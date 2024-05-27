export default function Layout({
  id,
  children,
}: {
  id: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{id}</div>
      <div>{children}</div>
    </>
  );
}
