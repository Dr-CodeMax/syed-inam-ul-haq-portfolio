export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-10 text-gray-500">
      {text}
    </div>
  );
}