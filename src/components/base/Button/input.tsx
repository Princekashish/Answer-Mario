
interface ButtonProps {
    bgColor: string;
    icon: React.ReactNode;
    text: string;
    onclick?: () => void;
}
const Button: React.FC<ButtonProps> = ({ bgColor, icon, text , onclick }) => (
    <button onClick={onclick} className={`${bgColor} px-6 py-3 text-white flex justify-center items-center gap-2 rounded-full font-semibold`}>
        {icon} {text}
    </button>
);
export default Button;
