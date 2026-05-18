const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {

  const variants = {

    primary:
      "bg-primary hover:bg-primaryDark text-white",

    secondary:
      "bg-white border border-borderColor text-textPrimary hover:bg-gray-50",

    success:
      "bg-success text-white hover:opacity-90",

    danger:
      "bg-danger text-white hover:opacity-90",
  };


  return (

    <button
      className={`
        px-4 py-2
        rounded-xl
        font-medium
        shadow-soft
        transition-all
        duration-200
        hover:-translate-y-0.5
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;