"use client";
import { Widget } from "@typeform/embed-react";

type Props = {
  onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
};

const FeedbackWidget = ({ onSubmit }: Props) => {
  const feedbackHandler = () => {
    setTimeout(() => {
      onSubmit(false);
    }, 1500);
  };

  return (
    <Widget
      id="fXNQFWeI"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
      onSubmit={feedbackHandler}
    />
  );
};

export default FeedbackWidget;
