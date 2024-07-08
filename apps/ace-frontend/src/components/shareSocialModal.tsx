import { X } from "lucide-react";
import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-1/4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Nerede paylaşmak istersin?</h2>
          <button onClick={onClose} className=" text-purple rounded">
            <X />
          </button>
        </div>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <TwitterShareButton url={url} title={title}>
            <XIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TumblrShareButton url={url} title={title}>
            <TumblrIcon size={40} round />
          </TumblrShareButton>
          <RedditShareButton url={url} title={title}>
            <RedditIcon size={40} round />
          </RedditShareButton>
          <EmailShareButton url={url} title={title}>
            <EmailIcon size={40} round />
          </EmailShareButton>
          <PinterestShareButton url={url} title={title} media={url}>
            <PinterestIcon size={40} round />
          </PinterestShareButton>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
