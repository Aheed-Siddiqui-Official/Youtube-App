import Skeleton from "./Skeleton";

const AppSkeleton = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.nav}>
        <Skeleton width="120px" height="32px" />
        <Skeleton width="200px" height="32px" />
        <Skeleton width="40px" height="40px" style={{ borderRadius: "50%" }} />
      </div>

      {/* Content */}
      <div style={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={styles.card}>
            <Skeleton width="100%" height="160px" />
            <Skeleton width="70%" height="20px" style={{ marginTop: 10 }} />
            <Skeleton width="50%" height="20px" style={{ marginTop: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
    gap: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
  },
};

export default AppSkeleton;
