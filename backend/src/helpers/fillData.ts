interface UserClientData {
  full_name: string;
  email: string;
  profile_picture: string;
  username: string;
  datatime_joined: string;
  user_id: string;  
  current_level: number;
  total_points: number;
  levelThreshold: number;
  is_active: boolean;
}

interface QuizData {
  question: string;
  option_a: string;
  option_b: string; 
  option_c: string;
  option_d: string;
  correct_answer: string;
}


const filterUserData = (user: any): UserClientData => ({
  full_name: user.full_name,
  email: user.email,
  profile_picture: user.profile_picture,
  username: user.username,
  datatime_joined: user.datatime_joined,
  user_id: user.user_id,
  current_level: user.current_level,
  total_points: user.total_points,
  levelThreshold: user.levelThreshold,
  is_active: user.is_active,
});

const quizData = (question : string , option_a : string , option_b : string , option_c : string , option_d : string , correct_answer : string ) : QuizData => {
  return {
    question: question,
    option_a: option_a,
    option_b: option_b,
    option_c: option_c,
    option_d: option_d,
    correct_answer: correct_answer,
  };
};

export { filterUserData, quizData };
