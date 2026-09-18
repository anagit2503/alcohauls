export default function AuthShell({ title, intro, children }) {
  return (
    <div className="wrap flex justify-center pt-14">
      <div className="w-full max-w-[420px]">
        <h1 className="font-display text-[38px] leading-tight">{title}</h1>
        {intro && <p className="mt-2 text-muted">{intro}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
