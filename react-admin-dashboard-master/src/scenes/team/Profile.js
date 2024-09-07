import React from 'react';
import Team from '.';
import Employeeprofile from './Employeeprofile';

export default function Profile() {
    const role = localStorage.getItem('role');
  return (
    <div>
        {role === 'HR' && <Team />}
        {role === 'Employee' && <Employeeprofile />}
    </div>
  )
}
