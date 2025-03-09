const InputField = ({ label, name, type = 'text', formik, placeholder }) => (
  <div>
    <label className="block text-white text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
      placeholder={placeholder}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-sm">{formik.errors[name]}</p>
    )}
  </div>
);
export default InputField;
