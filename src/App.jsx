import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import SupervisorLayout from './../src/components/layouts/SupervisorLayout';
import TeacherLayout    from './../src/components/layouts/TeacherLayout';
import StudentLayout    from './../src/components/layouts/StudentLayout';

// Auth
import LoginPage from './pages/Login/LoginPage';

// Supervisor pages
import SupervisorDashboard    from './pages/supervisor/SupervisorDashboard';
import TeachersListPage        from './pages/supervisor/TeacherListPage';
import TeacherProfilePage      from './pages/supervisor/TeacherProfilePage';
import StudentsListPage        from './pages/supervisor/StudentsListPage';
import StudentProfilePage      from './pages/supervisor/StudentProfilePage';
import SupervisorSessionsPage  from './pages/supervisor/SupervisorSessionsPage';

// Teacher pages
import TeacherDashboard   from './pages/teacher/TeacherDashboard';
import TeacherTermPage    from './pages/teacher/TeacherTermPage';
import TeacherSessionsPage from './pages/teacher/TeacherSessionsPage';
import ReportWritingPage  from './pages/teacher/ReportWritingPage';

// Student pages
import StudentDashboard   from './pages/student/StudentDashboard';
import StudentSessionsPage from './pages/student/StudentSessionsPage';

function RootRedirect() {
    const { user, role } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (role === 'supervisor') return <Navigate to="/supervisor" replace />;
    if (role === 'teacher')    return <Navigate to="/teacher"    replace />;
    if (role === 'student')    return <Navigate to="/student"    replace />;
    return <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* Root */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* ── Supervisor ── */}
                    <Route path="/supervisor" element={<SupervisorLayout />}>
                        <Route index element={<SupervisorDashboard />} />
                        <Route path="teachers" element={<TeachersListPage />} />
                        <Route
                            path="teachers/:teacherId"
                            element={<TeacherProfilePage />}
                        />
                        <Route path="students" element={<StudentsListPage />} />
                        <Route
                            path="students/:studentId"
                            element={<StudentProfilePage />}
                        />
                        <Route
                            path="students/:studentId/terms/:termId"
                            element={<SupervisorSessionsPage />}
                        />
                    </Route>

                    {/* ── Teacher ── */}
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route
                            path="students/:studentId/terms/:termId"
                            element={<TeacherTermPage />}
                        />
                        <Route
                            path="students/:studentId/terms/:termId/sessions"
                            element={<TeacherSessionsPage />}
                        />
                        <Route
                            path="sessions/:sessionId/report"
                            element={<ReportWritingPage />}
                        />
                    </Route>

                    {/* ── Student ── */}
                    <Route path="/student" element={<StudentLayout />}>
                        <Route index element={<StudentDashboard />} />
                        <Route
                            path="terms/:termId/sessions"
                            element={<StudentSessionsPage />}
                        />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
