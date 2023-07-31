import { useUserContext } from '../UserContext';

export default function WelcomeScreen() {
  const { user } = useUserContext();

  console.log(user.firstName);
  console.log(user.lastName);

  return (
    <div>
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
    </div>
  );
}