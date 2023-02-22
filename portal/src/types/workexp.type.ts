export type WorkExperiencePds = [
  {
    appointmentStatus: string;
    companyName: string;
    from: string;
    isGovernmentService: boolean;
    monthlySalary: number;
    positionTitle: string;
    salaryGrade: string;
    to: string;
    _id: string;
  }
];

export type WorkExperienceToSubmit = {
  vppId: string;
  workExperienceSheet: Array<WorkExperience>;
};

export type Accomplishment = {
  accomplishment: string;
};

export type Duty = {
  duty: string;
};

export type WorkExperience = {
  basic: {
    workExperienceId: string;
    office: string;
    supervisor: string;
  };
  duties: Array<Duty>;
  accomplishments: Array<Accomplishment>;
};

// URL: /pds/work-experience-sheet/:posting_applicant_id
// method: POST

// Body:
// {
//     vppId: '123-123-1231-123',
//     withRelevantExperience: true,
//     workExperienceSheet: [
//     	{
//     	  workExperienceId: "1235-12345-12345",
//     	  accomplishments:  [{
//     	  	accomplishment: "asd asd asdadas asdad"
//     	  }],
//     	  duties: [{
//     	  	duty: "asdasd asdasd asdad asdasd asdasd asd"
//     	  }]
//     	}
//     ]
// }
{
  // withRelevantExperience: boolean,
  // workExperienceSheet: {
  //   basic: {
  //   workExperienceId: string;
  //   office: string;
  //   supervisor: string;
  // };
  // duties: {
  //   duty: string;
  // }[];
  // accomplishments: {
  //   accomplishment: string;
  // }[];
  // }[]
}
