export default function Logo({ small, icon }: { small?: boolean; icon?: boolean }) {
  return (
    <h1 className="inline">
      <strong>
        {icon ? (
          <img className="mx-auto w-9" alt="Cal" src="/cal-com-icon-white.svg" />
        ) : (
          <img
            className={small ? "h-10 w-auto" : "h-8 w-auto"}
            alt="Diglactic Scheduler logo"
            src="/diglactic-logo-word-dark.svg"
          />
        )}
      </strong>
    </h1>
  );
}
