import React, { useState } from 'react';
import TimePickerPicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

function TimePicker() {
  const [value, onChange] = useState(new Date());

     return (
        <div>
            <TimePickerPicker onChange={onChange} value={value} />
        </div>
    );
}
export default TimePicker;