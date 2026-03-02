function InsightCard({ color, text }) {
  return (
    <div className={`insight-card ${color}`}>
      {text}
    </div>
  );
}

export default InsightCard;
