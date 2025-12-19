/**
 * Decorations Component
 * Corner decorations and Christmas styling elements
 */
export default function Decorations() {
  return (
    <>
      {/* Christmas Corner Decorations */}
      <img
        src="/assets/spark.webp"
        alt="Christmas Parol"
        className="hidden 2xl:block absolute top-1/2 left-5 w-10 h-10 md:w-16 md:h-16 object-contain z-20 pointer-events-none"
        style={{ transform: 'translate(-10%, -10%)' }}
      />
      <img
        src="/assets/star.webp"
        alt="Christmas Decoration"
        className="hidden 2xl:block absolute top-0 right-0 w-28 h-28 md:w-36 md:h-36 object-contain z-20 pointer-events-none"
        style={{ transform: 'translate(10%, -10%)' }}
      />
      <img
        src="/assets/snowflake.webp"
        alt="Christmas Element"
        className="hidden 2xl:block absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 object-contain z-20 pointer-events-none"
        style={{ transform: 'translate(-15%, 15%)' }}
      />
    </>
  );
}
