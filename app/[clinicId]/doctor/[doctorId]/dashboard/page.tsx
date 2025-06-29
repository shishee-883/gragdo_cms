import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getClinicById } from "@/lib/actions/clinics"
import { getDoctorById } from "@/lib/actions/doctors"

interface DoctorDashboardPageProps {
  params: {
    clinicId: string
    doctorId: string
  }
}

export default async function DoctorDashboardPage({ params }: DoctorDashboardPageProps) {
  // Verify clinic and doctor exist
  const clinic = await getClinicById(params.clinicId)
  const doctor = await getDoctorById(params.doctorId)
  
  if (!clinic || !doctor) {
    notFound()
  }

  // Get dashboard stats for this clinic and doctor
  const stats = await getDashboardStats(params.clinicId, params.doctorId)

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" clinicId={params.clinicId} userId={params.doctorId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <h3 className="text-gray-500 text-sm mb-1">Today's Appointments</h3>
              <p className="text-4xl font-bold">{stats.todayAppointments || 0}</p>
            </div>
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <h3 className="text-gray-500 text-sm mb-1">Today's Patients</h3>
              <p className="text-4xl font-bold">{stats.todayPatients || 0}</p>
            </div>
          </div>

          {/* Time Filter and Add Patient */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6 lg:mt-[30px] mb-6">
            <Tabs defaultValue="today" className="w-full lg:w-[561px]">
              <TabsList className="w-full h-[50px] md:h-[54px] p-0 bg-white rounded-2xl grid grid-cols-3">
                <TabsTrigger
                  value="today"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="yesterday"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Yesterday
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  This Month
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-[50px] md:w-[54px] h-[50px] md:h-[54px] bg-white rounded-[10.8px] flex items-center justify-center">
                <Filter className="w-[20px] h-[23px] md:w-[23px] md:h-[26px] text-[#7165e1]" />
              </div>
              <Button variant="digigo" size="digigo" className="w-full sm:w-[180px] md:w-[200px] h-[50px] md:h-[54px] text-sm md:text-base">
                <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                Add Patient
              </Button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-[20px] shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Appointments</h2>
              <Button variant="link" className="text-[#7165e1]">View All</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-3 px-2">S.No</th>
                    <th className="py-3 px-2">Patient's ID</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Age</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-2">1</td>
                    <td className="py-3 px-2">PAT123456</td>
                    <td className="py-3 px-2">K. Vijay</td>
                    <td className="py-3 px-2">22</td>
                    <td className="py-3 px-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">2</td>
                    <td className="py-3 px-2">PAT454575</td>
                    <td className="py-3 px-2">P. Sandeep</td>
                    <td className="py-3 px-2">30</td>
                    <td className="py-3 px-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">3</td>
                    <td className="py-3 px-2">PAT787764</td>
                    <td className="py-3 px-2">Ch. Asritha</td>
                    <td className="py-3 px-2">25</td>
                    <td className="py-3 px-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">4</td>
                    <td className="py-3 px-2">PAT454215</td>
                    <td className="py-3 px-2">P. Ravi</td>
                    <td className="py-3 px-2">32</td>
                    <td className="py-3 px-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">5</td>
                    <td className="py-3 px-2">PAT548721</td>
                    <td className="py-3 px-2">K. Arun</td>
                    <td className="py-3 px-2">32</td>
                    <td className="py-3 px-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">In Progress</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">6</td>
                    <td className="py-3 px-2">PAT457245</td>
                    <td className="py-3 px-2">K. Satya</td>
                    <td className="py-3 px-2">32</td>
                    <td className="py-3 px-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Pending</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">7</td>
                    <td className="py-3 px-2">PAT786421</td>
                    <td className="py-3 px-2">B. Kiran</td>
                    <td className="py-3 px-2">32</td>
                    <td className="py-3 px-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Calendar</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-l-lg rounded-r-none border-r-0">May</Button>
                  <Button variant="outline" className="rounded-l-none rounded-r-lg">2023</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Days of Week */}
                <div className="text-center p-2 text-gray-500 font-medium">Mo</div>
                <div className="text-center p-2 text-gray-500 font-medium">Tu</div>
                <div className="text-center p-2 text-gray-500 font-medium">We</div>
                <div className="text-center p-2 text-gray-500 font-medium">Th</div>
                <div className="text-center p-2 text-gray-500 font-medium">Fr</div>
                <div className="text-center p-2 text-gray-500 font-medium">Sa</div>
                <div className="text-center p-2 text-gray-500 font-medium">Su</div>
                
                {/* Calendar Days */}
                <div className="text-center p-2">1</div>
                <div className="text-center p-2">2</div>
                <div className="text-center p-2">3</div>
                <div className="text-center p-2">4</div>
                <div className="text-center p-2">5</div>
                <div className="text-center p-2">6</div>
                <div className="text-center p-2">7</div>
                <div className="text-center p-2">8</div>
                <div className="text-center p-2">9</div>
                <div className="text-center p-2">10</div>
                <div className="text-center p-2">11</div>
                <div className="text-center p-2">12</div>
                <div className="text-center p-2">13</div>
                <div className="text-center p-2">14</div>
                <div className="text-center p-2">15</div>
                <div className="text-center p-2">16</div>
                <div className="text-center p-2">17</div>
                <div className="text-center p-2 bg-[#7165e1] text-white rounded-lg">18</div>
                <div className="text-center p-2">19</div>
                <div className="text-center p-2">20</div>
                <div className="text-center p-2">21</div>
                <div className="text-center p-2">22</div>
                <div className="text-center p-2">23</div>
                <div className="text-center p-2">24</div>
                <div className="text-center p-2">25</div>
                <div className="text-center p-2">26</div>
                <div className="text-center p-2">27</div>
                <div className="text-center p-2">28</div>
                <div className="text-center p-2">29</div>
                <div className="text-center p-2">30</div>
                <div className="text-center p-2">31</div>
                <div className="text-center p-2 text-gray-300">1</div>
                <div className="text-center p-2 text-gray-300">2</div>
                <div className="text-center p-2 text-gray-300">3</div>
                <div className="text-center p-2 text-gray-300">4</div>
              </div>
            </div>

            {/* Appointments Overview */}
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Appointments Overview</h2>
              
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Pie Chart */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Male segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#7165e1"
                      strokeWidth="20"
                      strokeDasharray="83.8 251.2"
                      strokeDashoffset="0"
                    />
                    {/* Female segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="20"
                      strokeDasharray="120.6 251.2"
                      strokeDashoffset="-83.8"
                    />
                    {/* Children segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#c4b5fd"
                      strokeWidth="20"
                      strokeDasharray="46.8 251.2"
                      strokeDashoffset="-204.4"
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold">Total</div>
                    <div className="text-3xl font-bold text-[#7165e1]">{stats.totalPatients || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#7165e1] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">Male</div>
                    <div className="text-lg font-bold">{stats.malePatients || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#a855f7] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">Female</div>
                    <div className="text-lg font-bold">{stats.femalePatients || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#c4b5fd] rounded-full"></div>
                  <div>
                    <div className="text-sm text-gray-500">Children</div>
                    <div className="text-lg font-bold">{stats.childPatients || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}