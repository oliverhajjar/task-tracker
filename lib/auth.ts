'use client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed (demo: base64 of password+salt; NOT secure)
}

const USERS_KEY = 'tasktracker_users';
const SESSION_KEY = 'tasktracker_session';

function hashPassword(pw: string): string {
  // DEMO ONLY: not secure. Production must use bcrypt/argon2 on server.
  return btoa(unescape(encodeURIComponent(pw + '::salt')));
}

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  const user: User = { id: 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36), name, email, password: hashPassword(password) };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== hashPassword(password)) {
    return { ok: false, error: 'Invalid email or password.' };
  }
  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
}

export function updateUserName(name: string) {
  const id = getCurrentUserId();
  if (!id) return;
  const users = getUsers();
  const u = users.find((x) => x.id === id);
  if (u) { u.name = name; saveUsers(users); }
}

export function changePassword(oldPw: string, newPw: string): { ok: boolean; error?: string } {
  const id = getCurrentUserId();
  if (!id) return { ok: false, error: 'Not logged in.' };
  const users = getUsers();
  const u = users.find((x) => x.id === id);
  if (!u) return { ok: false, error: 'User not found.' };
  if (u.password !== hashPassword(oldPw)) return { ok: false, error: 'Current password is incorrect.' };
  u.password = hashPassword(newPw);
  saveUsers(users);
  return { ok: true };
}

export function deleteAccount() {
  const id = getCurrentUserId();
  if (!id) return;
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
  // remove user data
  localStorage.removeItem('tasktracker_data_' + id);
  logout();
}
