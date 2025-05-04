from flask import Flask, request, render_template
import joblib
import pandas as pd
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load the model, scaler, and month encoder
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')
month_ohe = joblib.load('month_ohe.pkl')

# Define the home route with a form
@app.route('/', methods=['GET', 'POST'])
def home():
    hours = None
    predictions = None
    error = None
    if request.method == 'POST':
        try:
            # Get input from the form
            start_time = request.form['start_time']  # e.g., "2025-05-10T18:00"
            end_time = request.form['end_time']      # e.g., "2025-05-10T22:00"
            special_event = int(request.form['special_event'])  # 0 or 1

            # Parse start and end times
            start_dt = pd.to_datetime(start_time)
            end_dt = pd.to_datetime(end_time)

            # Ensure start is before end and same day
            if start_dt > end_dt:
                error = "Start time must be before end time"
            elif start_dt.date() != end_dt.date():
                error = "Start and end times must be on the same day"
            else:
                # Generate hourly range
                hours = []
                predictions = []
                current_dt = start_dt
                while current_dt <= end_dt:
                    hour = current_dt.hour
                    weekday = current_dt.weekday()
                    month = current_dt.month

                    # Create features
                    data = {
                        'is_weekend': int(weekday >= 5),
                        'special_event': special_event,
                        'hour_sin': np.sin(2 * np.pi * hour / 24),
                        'hour_cos': np.cos(2 * np.pi * hour / 24),
                        'dow_sin': np.sin(2 * np.pi * weekday / 7),
                        'dow_cos': np.cos(2 * np.pi * weekday / 7),
                        'month': month
                    }

                    # One-hot encode month
                    month_vec = month_ohe.transform([[data['month']]])[0]
                    month_cols = [f'month_{m}' for m in month_ohe.categories_[0][1:]]
                    for i, col in enumerate(month_cols):
                        data[col] = month_vec[i]

                    # Create DataFrame
                    input_data = pd.DataFrame([data])
                    feature_cols = ['is_weekend', 'special_event', 'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos'] + month_cols
                    input_data = input_data[feature_cols]

                    # Scale and predict
                    input_scaled = scaler.transform(input_data)
                    prediction = model.predict(input_scaled)[0]

                    # Append results
                    hours.append(hour)
                    predictions.append(round(prediction, 2))

                    # Increment by one hour
                    current_dt += pd.Timedelta(hours=1)

        except KeyError as e:
            error = f"Form input error: Missing {str(e)}"
        except ValueError as e:
            error = f"Invalid input: {str(e)}"

    return render_template('index.html', hours=hours, predictions=predictions, error=error)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)