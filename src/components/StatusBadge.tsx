interface Props {
  connected: boolean;
}

export default function StatusBadge({ connected }: Props) {
  return (
    <div className={`flex items-center gap-1.5 lg:gap-[0.313vw] text-xs lg:text-[0.833vw] lg:leading-[1.5vw] font-medium px-2.5 lg:px-[0.833vw] py-1 lg:py-[0.208vw] rounded-full
      ${connected
        ? " bg-green-900/30 text-green-400"
        : " bg-red-900/30 text-red-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 lg:h-[0.55vw] lg:w-[0.55vw] rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
      {connected ? "Live" : "Reconnecting…"}
    </div>
  );
}
