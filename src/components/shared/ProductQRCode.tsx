import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ProductQRCode = ({ productId }: { productId: string }) => {
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const productUrl = `https://mon-site.com/products/${productId}`;
    setQrValue(productUrl);
  }, [productId]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <QRCode value={qrValue} size={256} />
      </div>
      <div className="flex gap-4 justify-center mt-4">
        <h4 className="text-lg  pb-4">Partager sur</h4>
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Partager sur Facebook">
          <FontAwesomeIcon icon={faFacebook} className="text-blue-800" />
        </a>

        {/* Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Découvrez ce produit incroyable !`}
          target="_blank"
          rel="noopener noreferrer"
          title="Partager sur Twitter">
          <FontAwesomeIcon
            icon={faTwitter}
            className="text-blue-400 text-xl hover:text-blue-600"
          />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=Découvrez ce produit incroyable ! ${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Partager sur WhatsApp">
          <FontAwesomeIcon
            icon={faWhatsapp}
            className="text-green-500 text-xl hover:text-green-700"
          />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Partager sur LinkedIn">
          <FontAwesomeIcon
            icon={faLinkedin}
            className="text-blue-700 text-xl hover:text-blue-900"
          />
        </a>
      </div>
    </div>
  );
};

export default ProductQRCode;
