export default function Template({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div className="flex flex-col w-full  h-screen">
      <main className="w-full md:h-screen grow">{children}</main>
    </div>
  );
}
