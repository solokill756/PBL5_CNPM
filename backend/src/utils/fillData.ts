interface UserClientData {
  full_name: string,
  email: string,
  profile_picture: string,
  username: string,
  datatime_joined: string,
  // user_id : string,
}
interface listFlashcardClientData {
  tile: string,
  description?: string,
  created_at: string,
}
const filterUserData = (user: any): UserClientData => ({
  full_name: user.full_name,
  email: user.email,
  profile_picture: user.profile_picture,
  username: user.username,
  datatime_joined: user.datatime_joined,
  // user_id : user.user_id,
});

const filterListFlashcardData = (flashcard: any): listFlashcardClientData => ({
  tile: flashcard.tile,
  description: flashcard.description,
  created_at: flashcard.created_at,
});

export { filterUserData, UserClientData, filterListFlashcardData, listFlashcardClientData };
