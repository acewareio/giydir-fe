"use client";

import Link from "next/link";
import React from "react";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

interface Props {
  size: number;
}

const Logo: React.FC<Props> = ({ size }) => {
  const [sessionData, setSessionData] = React.useState<Session | null>(null);

  const supabase = createClientComponentClient();

  React.useEffect(() => {
    const getSession = async () => {
      const session = await supabase.auth.getSession();
      setSessionData(session.data.session);
    };

    getSession();
  }, []);

  return (
    <Link href={sessionData ? "/app" : "/"} className="w-8 h-8">
      <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="247.996"
          y="60.3292"
          width="46.3231"
          height="140.377"
          transform="rotate(43.8165 247.996 60.3292)"
          fill="#7844F6"
        />
        <rect
          x="285"
          y="223.862"
          width="46.3231"
          height="140.377"
          transform="rotate(133.059 285 223.862)"
          fill="#7844F6"
        />
        <path
          d="M191.642 1L225.067 33.0719L70.5935 194.062L37.1686 161.99L191.642 1Z"
          fill="url(#paint0_linear_142_182)"
        />
        <path
          d="M35 165.34L67.0373 131.882L228.187 286.189L196.15 319.647L35 165.34Z"
          fill="url(#paint1_linear_142_182)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_142_182"
            x1="131.594"
            y1="1"
            x2="131.594"
            y2="319.647"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7B45FC" />
            <stop offset="1" stopColor="#492996" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_142_182"
            x1="131.594"
            y1="1"
            x2="131.594"
            y2="319.647"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7B45FC" />
            <stop offset="1" stopColor="#492996" />
          </linearGradient>
        </defs>
      </svg>
    </Link>
  );
};

export default Logo;
