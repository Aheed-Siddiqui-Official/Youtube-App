const Skeleton = ({ width, height, style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
};

export default Skeleton;
