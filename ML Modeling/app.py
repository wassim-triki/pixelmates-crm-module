# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from your React app

# Load artifacts once
model     = joblib.load('model.pkl')
scaler    = joblib.load('scaler.pkl')
month_ohe = joblib.load('month_ohe.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    """
    POST JSON:
      {
        "start_time": "2025-05-10T07:00",
        "end_time":   "2025-05-10T23:45",
        "special_event": 0
      }
    Returns JSON:
      {
        "hours":       [7, 8, 9, …],
        "predictions": [42.17, 55.03, …]
      }
    """
    data = request.get_json(force=True)
    start_time    = data.get('start_time')
    end_time      = data.get('end_time')
    special_event = int(data.get('special_event', 0))

    try:
        # parse
        start_dt = pd.to_datetime(start_time)
        end_dt   = pd.to_datetime(end_time)

        if start_dt > end_dt:
            return jsonify(error="Start time must be before end time"), 400
        if start_dt.date() != end_dt.date():
            return jsonify(error="Start and end must be on the same day"), 400

        hours = []
        preds = []
        current = start_dt

        # prepare one-hot month columns
        month_cols = [f'month_{m}' for m in month_ohe.categories_[0][1:]]

        while current <= end_dt:
            h   = current.hour
            wd  = current.weekday()
            mth = current.month

            # base features
            feats = {
                'is_weekend':    int(wd >= 5),
                'special_event': special_event,
                'hour_sin':      np.sin(2 * np.pi * h / 24),
                'hour_cos':      np.cos(2 * np.pi * h / 24),
                'dow_sin':       np.sin(2 * np.pi * wd / 7),
                'dow_cos':       np.cos(2 * np.pi * wd / 7),
            }

            # month OHE
            vec = month_ohe.transform([[mth]])[0]
            for i, col in enumerate(month_cols):
                feats[col] = vec[i]

            # to DF → scale → predict
            df = pd.DataFrame([feats])
            feature_order = ['is_weekend','special_event','hour_sin','hour_cos','dow_sin','dow_cos'] + month_cols
            X = scaler.transform(df[feature_order])
            p = model.predict(X)[0]

            hours.append(h)
            preds.append(round(float(p), 2))

            current += pd.Timedelta(hours=1)

        return jsonify(hours=hours, predictions=preds)

    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
