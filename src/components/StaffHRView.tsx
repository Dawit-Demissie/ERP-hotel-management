import React, { useState } from 'react';
import { 
  Users2, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Sparkles, 
  Award, 
  UserCheck, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight, 
  UserPlus, 
  TrendingUp, 
  Check 
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { StaffMember, ShiftSchedule } from '../types';

export const StaffHRView: React.FC = () => {
  const { staff, shifts, toggleStaffClock, updateShift } = useHotel();
  const [activeTab, setActiveTab] = useState<'roster' | 'shifts' | 'payroll' | 'ai-scheduling'>('roster');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [payrollProcessed, setPayrollProcessed] = useState<boolean>(false);

  const departments = ['All', 'Executive Management', 'Front Office', 'Food & Beverage', 'Housekeeping', 'Finance'];

  const filteredStaff = staff.filter(s => {
    if (selectedDept !== 'All' && s.department !== selectedDept) return false;
    return true;
  });

  const daysOfWeek: ShiftSchedule['dayOfWeek'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const totalMonthlyPayroll = staff.reduce((acc, s) => acc + s.monthlySalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#b46a36] mb-1 font-bold tracking-[0.2em] uppercase">
            <Users2 className="w-3.5 h-3.5" />
            <span>Human Capital & Operations</span>
          </div>
          <h1 className="text-3xl font-serif-luxury font-bold text-[#18332f]">
            Workforce & Staff Rostering
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            Role-Based Access Control · Weekly Shift Matrix · Attendance Clocking · AI Workforce Pacing
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e5e0d6] rounded-full shadow-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'roster' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Staff Directory
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'shifts' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Shift Matrix
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'payroll' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Payroll & Leaves
          </button>
          <button
            onClick={() => setActiveTab('ai-scheduling')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-scheduling' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b46a36]" />
            <span>AI Scheduling</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STAFF DIRECTORY & TIME CLOCK */}
      {activeTab === 'roster' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'bg-white border border-[#e5e0d6] text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#5f6a65]">
              <span className="font-semibold text-[#18332f]">{staff.filter(s => s.clockedIn).length} On Duty</span>
              <span className="text-[#c7bfb1]"> · </span>
              <span>{staff.length} Total Team Members</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredStaff.map((member) => (
              <div 
                key={member.id}
                className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#18332f] text-[#f6f4ee] font-serif-luxury font-bold flex items-center justify-center text-sm shadow-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#18332f]">{member.name}</h3>
                        <p className="text-[11px] font-semibold text-[#b46a36]">{member.role}</p>
                        <p className="text-[10px] text-[#88938c]">{member.department}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      member.clockedIn 
                        ? 'text-[#18332f] border-[#18332f]/30 bg-[#18332f]/10' 
                        : 'text-[#88938c] border-[#e5e0d6] bg-[#f8f6f1]'
                    }`}>
                      {member.clockedIn ? '● Clocked In' : '○ Off Duty'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0ece3] space-y-2 text-xs text-[#5f6a65]">
                    <div className="flex justify-between">
                      <span className="text-[#88938c]">Assigned Shift:</span>
                      <span className="font-medium text-[#18332f]">{member.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#88938c]">Guest Rating:</span>
                      <span className="font-bold text-[#b46a36]">{member.performanceScore}% Positive</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#88938c]">Monthly Compensation:</span>
                      <span className="font-semibold text-[#18332f]">${member.monthlySalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0ece3] flex items-center justify-between">
                  <span className="text-[11px] text-[#88938c]">{member.phone}</span>
                  <button
                    onClick={() => toggleStaffClock(member.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      member.clockedIn
                        ? 'bg-[#f4efe6] hover:bg-[#eadecb] text-[#b46a36] border border-[#b46a36]/30'
                        : 'bg-[#18332f] hover:bg-[#112421] text-white shadow-xs'
                    }`}
                  >
                    {member.clockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: SHIFT SCHEDULING MATRIX */}
      {activeTab === 'shifts' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ece3]">
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                Weekly Departmental Shift Matrix
              </h2>
              <p className="text-xs text-[#5f6a65]">Click any shift badge to cycle between Morning, Evening, Night and Off</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#88938c]">
              <span>Morning: 07:00 - 15:30</span>
              <span className="text-[#c7bfb1]">·</span>
              <span>Evening: 15:00 - 23:30</span>
              <span className="text-[#c7bfb1]">·</span>
              <span>Night: 23:00 - 07:30</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Staff Member</th>
                  <th className="py-3 px-4">Department</th>
                  {daysOfWeek.map(d => (
                    <th key={d} className="py-3 px-3 text-center">{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-[#fcfbf8] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#18332f]">{member.name}</td>
                    <td className="py-3.5 px-4 text-[#5f6a65]">{member.department}</td>
                    {daysOfWeek.map((day) => {
                      const current = shifts.find(s => s.staffId === member.id && s.dayOfWeek === day);
                      const shiftVal = current?.shift || 'Morning';

                      return (
                        <td key={day} className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const nextShift = shiftVal === 'Morning' ? 'Evening' : shiftVal === 'Evening' ? 'Night' : shiftVal === 'Night' ? 'Off' : 'Morning';
                              if (current) {
                                updateShift(current.id, nextShift);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                              shiftVal === 'Morning' ? 'bg-[#18332f] text-white shadow-xs' :
                              shiftVal === 'Evening' ? 'bg-[#f4efe6] text-[#b46a36] border border-[#b46a36]/30' :
                              shiftVal === 'Night' ? 'bg-[#e7eef4] text-[#1e3a5f] border border-[#1e3a5f]/20' :
                              'bg-[#f8f6f1] text-[#88938c] border border-[#e5e0d6]'
                            }`}
                          >
                            {shiftVal}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PAYROLL & LEAVE MANAGEMENT */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
              <span className="text-xs text-[#5f6a65] font-semibold uppercase tracking-wider text-[10px]">Monthly Salary Pool</span>
              <div className="text-3xl font-serif-luxury font-bold text-[#18332f]">
                ${totalMonthlyPayroll.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#88938c]">5 Executive & Operational Leads</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
              <span className="text-xs text-[#5f6a65] font-semibold uppercase tracking-wider text-[10px]">Performance Bonus Allocation</span>
              <div className="text-3xl font-serif-luxury font-bold text-[#18332f]">
                $4,850.00
              </div>
              <p className="text-[11px] text-[#b46a36] font-medium">95.4% average guest satisfaction</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
              <span className="text-xs text-[#5f6a65] font-semibold uppercase tracking-wider text-[10px]">Payroll Run Status</span>
              <div className="text-xl font-bold text-[#18332f]">
                {payrollProcessed ? 'Authorized & Transferred' : 'Pending Authorization'}
              </div>
              <button
                onClick={() => setPayrollProcessed(true)}
                disabled={payrollProcessed}
                className="mt-1 px-4 py-2 bg-[#18332f] hover:bg-[#112421] disabled:bg-[#f8f6f1] disabled:text-[#88938c] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer shadow-xs"
              >
                {payrollProcessed ? '✓ Batch Ledger Confirmed' : 'Authorize Payroll Run'}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
              Employee Compensation & Leave Balances
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Employee</th>
                    <th className="py-3 px-4">Base Salary</th>
                    <th className="py-3 px-4">Overtime / Bonus</th>
                    <th className="py-3 px-4">Statutory Deductions</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4 rounded-r-xl">Annual Leave Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                  {staff.map((s) => {
                    const bonus = Math.round(s.monthlySalary * 0.10);
                    const deductions = Math.round(s.monthlySalary * 0.12);
                    const net = s.monthlySalary + bonus - deductions;

                    return (
                      <tr key={s.id} className="hover:bg-[#fcfbf8] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#18332f]">{s.name}</td>
                        <td className="py-3 px-4 font-medium">${s.monthlySalary.toLocaleString()}</td>
                        <td className="py-3 px-4 text-[#18332f] font-semibold">+${bonus}</td>
                        <td className="py-3 px-4 text-[#88938c]">-${deductions}</td>
                        <td className="py-3 px-4 text-[#b46a36] font-bold font-serif-luxury text-sm">${net.toLocaleString()}</td>
                        <td className="py-3 px-4 text-[#5f6a65]">18 days remaining</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: AI WORKFORCE SCHEDULING OPTIMIZER */}
      {activeTab === 'ai-scheduling' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f0ece3]">
            <div className="p-2.5 rounded-full bg-[#f4efe6] text-[#b46a36]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                AI Workforce Demand & Shift Rostering Recommendations
              </h2>
              <p className="text-xs text-[#5f6a65]">
                Correlates room occupancy pace with banquet covers and housekeeping turnover bottlenecks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#18332f]">Front Office Shift Overlap on Friday</span>
                <span className="text-[10px] text-[#b46a36] font-bold px-2 py-0.5 rounded-full bg-[#f4efe6]">High Impact</span>
              </div>
              <p className="text-xs text-[#5f6a65] leading-relaxed">
                19 check-ins forecasted between 14:00 and 17:30. Overlap the morning and evening receptionists to guarantee zero-wait lobby greeting and welcome champagne service.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#18332f]">Executive Housekeeping Fast-Track</span>
                <span className="text-[10px] text-[#18332f] font-bold px-2 py-0.5 rounded-full bg-[#18332f]/10">Quality Guard</span>
              </div>
              <p className="text-xs text-[#5f6a65] leading-relaxed">
                2 Presidential Penthouses departing Saturday 11:00 with back-to-back arrivals at 14:30. Schedule Beatriz Morales with 2 assistants for expedited VIP turndown sanitization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
