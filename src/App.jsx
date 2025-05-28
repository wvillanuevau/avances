import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { useState } from "react";
import { Progress } from "./components/ui/progress";
import { format, parseISO, isWithinInterval } from "date-fns";

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "supervisor", password: "sup456", role: "supervisor" },
  { username: "tecnico", password: "tec789", role: "tecnico" },
];

export default function ProjectTrackerApp() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [projects, setProjects] = useState([{
    id: 1,
    name: "Complejo Alegría",
    progress: 45,
    tasks: [
      { name: "Soldar columnas principales", completed: false, completedBy: "" }
    ],
    updates: [
      {
        date: "2025-05-27",
        note: "Se instaló estructura metálica en un 45% del área.",
        image: "https://via.placeholder.com/150"
      }
    ]
  }]);

  const [newNote, setNewNote] = useState("");
  const [newProgress, setNewProgress] = useState(0);
  const [newImage, setNewImage] = useState("");
  const [newTask, setNewTask] = useState("");

  const handleUpdate = (projectId) => {
    const updatedProjects = projects.map((proj) => {
      if (proj.id === projectId) {
        return {
          ...proj,
          progress: loggedInUser.role === "admin" || loggedInUser.role === "supervisor" ? newProgress : proj.progress,
          updates: [
            ...proj.updates,
            {
              date: new Date().toISOString().split("T")[0],
              note: newNote,
              image: newImage || "https://via.placeholder.com/150"
            }
          ]
        };
      }
      return proj;
    });
    setProjects(updatedProjects);
    setNewNote("");
    setNewProgress(0);
    setNewImage("");
  };

  const handleAddTask = (projectId) => {
    const updatedProjects = projects.map((proj) => {
      if (proj.id === projectId && newTask.trim() !== "") {
        return {
          ...proj,
          tasks: [...(proj.tasks || []), { name: newTask, completed: false, completedBy: "" }]
        };
      }
      return proj;
    });
    setProjects(updatedProjects);
    setNewTask("");
  };

  const handleToggleTaskCompletion = (projectId, taskIndex) => {
    const updatedProjects = projects.map((proj) => {
      if (proj.id === projectId) {
        const updatedTasks = proj.tasks.map((task, index) => {
          if (index === taskIndex) {
            return {
              ...task,
              completed: !task.completed,
              completedBy: task.completed ? "" : loggedInUser.username
            };
          }
          return task;
        });
        return {
          ...proj,
          tasks: updatedTasks
        };
      }
      return proj;
    });
    setProjects(updatedProjects);
  };

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("Credenciales inválidas");
    }
  };

  if (!loggedInUser) {
    return (
      <div className="p-4 space-y-4 max-w-sm mx-auto">
        <h1 className="text-xl font-bold text-center">Iniciar Sesión</h1>
        <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} className="w-full">Ingresar</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Seguimiento de Proyectos ({loggedInUser.role})</h1>
      <Tabs defaultValue="project1" className="w-full">
        <TabsList className="overflow-x-auto">
          {projects.map((project) => (
            <TabsTrigger key={project.id} value={`project${project.id}`}>
              {project.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {projects.map((project) => (
          <TabsContent key={project.id} value={`project${project.id}`}>
            <Card>
              <CardContent className="space-y-4">
                <h2 className="font-semibold">{project.name}</h2>
                <Progress value={project.progress} />
                <p className="text-sm">Avance actual: {project.progress}%</p>

                {(loggedInUser.role === "admin" || loggedInUser.role === "supervisor" || loggedInUser.role === "tecnico") && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Agregar observación"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    {(loggedInUser.role === "admin" || loggedInUser.role === "supervisor") && (
                      <Input
                        type="number"
                        placeholder="Nuevo porcentaje de avance"
                        value={newProgress}
                        onChange={(e) => setNewProgress(Number(e.target.value))}
                      />
                    )}
                    <Input
                      placeholder="URL de imagen (opcional)"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                    />
                    <Button onClick={() => handleUpdate(project.id)}>Guardar avance</Button>
                  </div>
                )}

                {(loggedInUser.role === "admin" || loggedInUser.role === "supervisor") && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Asignar nueva tarea</h3>
                    <Input
                      placeholder="Nueva tarea"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Button onClick={() => handleAddTask(project.id)}>Agregar tarea</Button>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Tareas asignadas</h3>
                  <ul className="list-disc list-inside">
                    {(project.tasks || []).map((task, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <div>
                          <span className={task.completed ? "line-through" : ""}>{task.name}</span>
                          {task.completed && <span className="text-xs text-green-600 ml-2">(completada por {task.completedBy})</span>}
                        </div>
                        {loggedInUser.role === "tecnico" && (
                          <Button variant="outline" size="sm" onClick={() => handleToggleTaskCompletion(project.id, idx)}>
                            {task.completed ? "Deshacer" : "Marcar como hecha"}
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Historial de tareas completadas</h3>
                  <ul className="list-disc list-inside">
                    {(project.tasks || []).filter(t => t.completed).map((task, i) => (
                      <li key={i}>{task.name} <span className="text-xs text-green-600">(por {task.completedBy})</span></li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Filtrar avances por fecha</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Historial de avances</h3>
                  {project.updates
                    .filter((u) => {
                      if (!filterStartDate || !filterEndDate) return true;
                      const updateDate = parseISO(u.date);
                      return isWithinInterval(updateDate, {
                        start: parseISO(filterStartDate),
                        end: parseISO(filterEndDate)
                      });
                    })
                    .map((u, i) => (
                      <div key={i} className="border rounded p-2">
                        <p className="text-sm font-medium">{u.date}</p>
                        <p>{u.note}</p>
                        <img src={u.image} alt="Evidencia" className="mt-2 rounded max-h-48" />
                      </div>
                    ))}
                  {project.updates.filter((u) => {
                    if (!filterStartDate || !filterEndDate) return false;
                    const updateDate = parseISO(u.date);
                    return !isWithinInterval(updateDate, {
                      start: parseISO(filterStartDate),
                      end: parseISO(filterEndDate)
                    });
                  }).length === project.updates.length && (
                    <p className="text-sm text-gray-500">No hay avances registrados en el rango de fechas seleccionado.</p>
                  )}
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
