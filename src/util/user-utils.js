export function getFullName(user) {
  if (!user) return null;

  if (user.name) {
    return user.name;
  }
  if (!user.first_name && !user.last_name) {
    return user.username;
  }

  return `${user.first_name} ${user.last_name}`;
}

export function getInitials(user) {
  if (!user) return null;

  if (!user.first_name || !user.last_name) {
    return user.username?.substring(0, 2)?.toUpperCase();
  }

  return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
}
