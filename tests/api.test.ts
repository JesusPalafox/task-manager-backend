import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '../src/models/task.js';
import type { User } from '../src/models/user.js';
import type { LoginInput, LoginResult, RegisterInput, RegisterResult } from '../src/types/auth.js';
import type { TaskListQuery, TaskListResult } from '../src/types/task-query.js';

const authDoubles = vi.hoisted(() => ({
  registerUser: vi.fn<(input: RegisterInput) => Promise<RegisterResult>>(),
  loginUser: vi.fn<(input: LoginInput) => Promise<LoginResult>>(),
  getAuthenticatedUser: vi.fn<(userId: string) => Promise<User>>(),
}));
const taskDoubles = vi.hoisted(() => ({
  listTasks: vi.fn<(query: TaskListQuery) => Promise<TaskListResult>>(),
  findTaskById: vi.fn<(id: string) => Promise<Task>>(),
  createTask: vi.fn<(title: string) => Promise<Task>>(),
  updateTask: vi.fn<(id: string, changes: object) => Promise<Task>>(),
  completeTask: vi.fn<(id: string) => Promise<Task>>(),
  deleteTask: vi.fn<(id: string) => Promise<void>>(),
}));
vi.mock('../src/services/auth.service.js', () => authDoubles);
vi.mock('../src/services/task.service.js', () => taskDoubles);
import { app } from '../src/app.js';
import { createAccessToken } from '../src/services/token.service.js';

const user: User = {
  id: '67112bfe47963b2be12c43a1', name: 'Ana Torres',
  email: 'ana@example.com', role: 'user',
  createdAt: new Date('2026-10-01T12:00:00.000Z'),
  updatedAt: new Date('2026-10-01T12:00:00.000Z'),
};
const admin: User = { ...user, id: '67112bfe47963b2be12c43a2', role: 'admin' };
const task: Task = {
  id: '67112bfe47963b2be12c43b1', title: 'Ejecutar pruebas automatizadas',
  status: 'pending',
  createdAt: new Date('2026-10-02T12:00:00.000Z'),
  updatedAt: new Date('2026-10-02T12:00:00.000Z'),
};
let userToken = '';
let adminToken = '';
beforeEach(async () => {
  vi.clearAllMocks();
  userToken = await createAccessToken(user);
  adminToken = await createAccessToken(admin);
  authDoubles.registerUser.mockResolvedValue({ user });
  authDoubles.loginUser.mockResolvedValue({
    user, accessToken: userToken, tokenType: 'Bearer', expiresIn: '1h',
  });
  authDoubles.getAuthenticatedUser.mockResolvedValue(user);
  taskDoubles.listTasks.mockResolvedValue({
    data: [task], meta: { page: 1, limit: 10, total: 1, totalPages: 1,
      hasNextPage: false, hasPreviousPage: false },
  });
  taskDoubles.findTaskById.mockResolvedValue(task);
  taskDoubles.createTask.mockResolvedValue(task);
  taskDoubles.updateTask.mockResolvedValue(task);
  taskDoubles.completeTask.mockResolvedValue({ ...task, status: 'completed' });
  taskDoubles.deleteTask.mockResolvedValue();
});

describe('Backend A11 — HTTP, documentación y seguridad', () => {
  it('publica OpenAPI, Swagger y cabeceras seguras', async () => {
    const health = await request(app).get('/health').expect(200);
    expect(health.body.status).toBe('ok');
    expect(health.headers['x-powered-by']).toBeUndefined();
    expect(health.headers['x-content-type-options']).toBe('nosniff');
    expect(typeof health.headers['x-request-id']).toBe('string');
    const spec = await request(app).get('/api-docs.json').expect(200);
    expect(spec.body.openapi).toBe('3.1.0');
    expect(spec.body.paths['/api/auth/me']).toBeDefined();
    expect(spec.body.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
    const swagger = await request(app).get('/api-docs/').expect(200);
    expect(swagger.headers['content-type']).toContain('text/html');
    expect(swagger.text).toContain('swagger-ui');
  });

  it('registra, inicia sesión y obtiene /me sin hash', async () => {
    const registration = await request(app).post('/api/auth/register')
      .send({ name: 'Ana Torres', email: 'ana@example.com', password: 'Frase segura para clase 2026' })
      .expect(201);
    expect(registration.body.data.user.passwordHash).toBeUndefined();
    const login = await request(app).post('/api/auth/login')
      .send({ email: 'ana@example.com', password: 'Frase segura para clase 2026' })
      .expect(200);
    expect(login.body.data.tokenType).toBe('Bearer');
    const me = await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`).expect(200);
    expect(me.body.data.user.email).toBe(user.email);
    expect(authDoubles.getAuthenticatedUser).toHaveBeenCalledWith(user.id);
  });

  it('rechaza rutas privadas sin token', async () => {
    const me = await request(app).get('/api/auth/me').expect(401);
    expect(me.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    const list = await request(app).get('/api/tasks').expect(401);
    expect(list.body.error.code).toBe('AUTHENTICATION_REQUIRED');
  });

  it('consulta paginada y creación con Bearer', async () => {
    const list = await request(app)
      .get('/api/tasks?page=1&limit=10&status=pending&search=pruebas&sortBy=title&order=asc')
      .set('Authorization', `Bearer ${userToken}`).expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(taskDoubles.listTasks).toHaveBeenCalledWith({
      page: 1, limit: 10, status: 'pending', search: 'pruebas',
      sortBy: 'title', order: 'asc',
    });
    const created = await request(app).post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: task.title }).expect(201);
    expect(created.body.data.title).toBe(task.title);
  });

  it('prohíbe eliminar a user y permite admin', async () => {
    const forbidden = await request(app).delete(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${userToken}`).expect(403);
    expect(forbidden.body.error.code).toBe('FORBIDDEN');
    expect(taskDoubles.deleteTask).not.toHaveBeenCalled();
    await request(app).delete(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${adminToken}`).expect(204);
    expect(taskDoubles.deleteTask).toHaveBeenCalledWith(task.id);
  });

  it('conserva 422, requestId y política CORS', async () => {
    const invalid = await request(app).get('/api/tasks?page=0')
      .set('Authorization', `Bearer ${userToken}`).expect(422);
    expect(invalid.body.error.code).toBe('QUERY_VALIDATION_ERROR');
    expect(typeof invalid.body.error.requestId).toBe('string');
    expect(taskDoubles.listTasks).not.toHaveBeenCalled();
    const allowed = await request(app).get('/health')
      .set('Origin', 'http://localhost:5173').expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    const blocked = await request(app).get('/health')
      .set('Origin', 'https://origen-invalido.example').expect(200);
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });
});
