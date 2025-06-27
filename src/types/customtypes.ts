export type userOtpData  = {
  email: string,
  otp: number
}
export type courseDetails = {
  coursename: string;
  courseprice: number;
  description: string;
  duration: number;
  instructorid: number;
};

export type courseDetails2 = {
  coursename: string;
  courseprice: number;
  description: string;
  duration: number;
};

export type lessonsObj = {
  moduleid: number;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl?: string;
};

export type moduleDetails = {
  courseid: number;
  title: string;
  description: string;
  order: number;
};

export type assignmentObj = {
  courseid: number;
  title: string;
  description: string;
  duedate: Date;
};


export type submissionObj = {
  userid: number;
  courseid: number;
  assignmentid: number;
  submissionUrl: string;
};

export type instructorDetails = {
  userid: number,
  qualification: string,
  bio: string,
  experience: number
}
