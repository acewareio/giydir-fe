"use client";

function LayoutFooter() {
  return (
    <div className="relative">
      <div className="lg:text-sm text-xs fixed bottom-0 bg-neutral-100 text-neutral-400 w-full text-center font-medium py-2">
        Copyright © 2024{" "}
        <a className="text-purple font-semibold" href="https://www.aceware.io/">
          Aceware.
        </a>{" "}
        All rights reserved.
      </div>
    </div>
  );
}

export default LayoutFooter;
