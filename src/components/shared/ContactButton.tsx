import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface ContactButtonProps {
  phoneNumber: string;
  message: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  phoneNumber,
  message,
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Button
      className="flex p-2 rounded-lg bg-[#25D366] hover:bg-[#25D366] text-white transition duration-300 shadow-lg transform hover:scale-105 "
      onClick={() => window.open(whatsappUrl, "_blank")}>
      <FontAwesomeIcon icon={faWhatsapp} className=" mr-2 h-5 w-5" />
      Merci de nous Contacter{" "}
    </Button>
  );
};

export default ContactButton;
