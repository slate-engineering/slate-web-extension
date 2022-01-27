export const getAvatarUrl = (user) => {
  if (user.photo) return user.photo;

  let colors = ["A9B9C1", "5B6B74", "3C444A", "D4DBDF", "293137"];
  return `https://source.boringavatars.com/marble/24px/${user.id}?square&colors=${colors}`;
};
