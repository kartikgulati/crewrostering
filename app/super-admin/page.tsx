"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TH, TD } from "@/components/ui/table";

interface Admin {
  id: string;
  username: string;
  role: string;
  quizLimit: number;
  _count: {
    quizzes: number;
    liveQuizzes: number;
    interactions: number;
  };
}

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    quizLimit: 10,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/admins");
      const data = await res.json();
      if (data.admins) setAdmins(data.admins);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ username: "", password: "", quizLimit: 10 });
        setCreating(false);
        await fetchAdmins();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Failed to create admin", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/super-admin/admins/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingId(null);
        setFormData({ username: "", password: "", quizLimit: 10 });
        await fetchAdmins();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Failed to update admin", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/super-admin/admins/${id}`, {
        method: "DELETE",
      });
      if (res.ok) await fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin", error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(admin: Admin) {
    setEditingId(admin.id);
    setFormData({
      username: admin.username,
      password: "", // Leave empty if not changing
      quizLimit: admin.quizLimit,
    });
    setCreating(false);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Super Admin Portal</h1>
        <Button onClick={() => { setCreating(true); setEditingId(null); setFormData({ username: "", password: "", quizLimit: 10 }); }}>
          {creating ? "Cancel" : "Create Admin"}
        </Button>
      </div>

      {(creating || editingId) && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Admin" : "Create Admin"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingId ? "Leave blank to keep current" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Quiz Limit</Label>
              <Input
                type="number"
                value={formData.quizLimit}
                onChange={e => setFormData({ ...formData, quizLimit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button
            onClick={editingId ? handleUpdate : handleCreate}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? "Saving..." : editingId ? "Update Admin" : "Create Admin"}
          </Button>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <Table>
          <thead>
            <tr>
              <TH>Username</TH>
              <TH>Quiz Limit</TH>
              <TH>Total Quizzes</TH>
              <TH>Live Quizzes</TH>
              <TH>Interactions</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {loading && admins.length === 0 ? (
              <tr>
                <TD colSpan={6} className="text-center py-10">Loading admins...</TD>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <TD colSpan={6} className="text-center py-10">No admins found.</TD>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <TD className="font-medium">{admin.username}</TD>
                  <TD>{admin.quizLimit}</TD>
                  <TD>{admin._count.quizzes}</TD>
                  <TD>{admin._count.liveQuizzes}</TD>
                  <TD>{admin._count.interactions}</TD>
                  <TD className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(admin)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(admin.id)}>Delete</Button>
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
