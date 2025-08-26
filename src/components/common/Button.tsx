type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export default function Button({
  children,
  type = 'button',
  onClick,
}: //className = '',
ButtonProps) {
  return (
    <button type={type} onClick={onClick} className="">
      {children}
    </button>
  );
}
