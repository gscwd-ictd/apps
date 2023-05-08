import create from "zustand"
import { EmployeeDetails } from "../types/data/employee.type"

export type EmployeeState = {
    employeeDetails: EmployeeDetails
    setEmployeeDetails: (employeeDetails: EmployeeDetails) => void
}

export const EMPLOYEE_DATA: EmployeeDetails = {
    user: {
        _id: '',
        email: ''
    },
    profile: {
        _id: '',
        companyId: null,
        firstName: '',
        middleName: '',
        lastName: '',
        nameExt: '',
        sex: '',
        birthDate: '',
        mobile: '',
        email: '',
        photoUrl: ''
    },
    employmentDetails: {
        userId: '',
        companyId: null,
        assignment: {
            id: '',
            name: '',
            positionId: '',
            positionTitle: ''
        },
        userRole: ''
    }
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
    employeeDetails: EMPLOYEE_DATA,
    setEmployeeDetails: (employeeDetails: EmployeeDetails) => {
        set((state) => ({ ...state, employeeDetails }))
    }
}))