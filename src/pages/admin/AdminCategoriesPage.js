import { useState } from "react";
import { useCategories } from "@/features/categories/useCategories";
import { createCategory, deleteCategory } from "@/features/categories/category.service";
/**
 * AdminCategoriesPage component.
 * Allows managing dynamic categories for the portfolio.
 */
export function AdminCategoriesPage() {
    const { categories, loading, refresh } = useCategories();
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    /**
     * Handle adding a new category.
     */
    async function handleAdd(e) {
        e.preventDefault();
        if (!newName.trim() || isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            // Logic: new categories are added at the end of the list
            const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 0;
            await createCategory({ name: newName.trim(), order: nextOrder });
            setNewName("");
            await refresh();
        }
        catch (error) {
            console.error(error);
            alert("Failed to create category");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    /**
     * Handle safe category deletion.
     */
    async function handleDelete(id) {
        if (!window.confirm("Delete this category? Warning: Ensure no photos are linked to it."))
            return;
        try {
            await deleteCategory(id);
            await refresh();
        }
        catch (error) {
            console.error(error);
            alert("Failed to delete category");
        }
    }
    if (loading)
        return <div style={{ opacity: 0.5 }}>Loading categories...</div>;
    return (<div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "2rem", opacity: 0.8 }}>Manage Categories</h1>

      {/* ADD CATEGORY FORM */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, marginBottom: "3rem" }}>
        <input type="text" placeholder="New Category Name (e.g. Street)" value={newName} onChange={e => setNewName(e.target.value)} disabled={isSubmitting} style={{
            flex: 1,
            padding: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            color: "#fff",
        }}/>
        <button type="submit" disabled={isSubmitting || !newName.trim()} style={{
            padding: "0 24px",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
            cursor: "pointer",
            opacity: isSubmitting ? 0.5 : 1,
        }}>
          {isSubmitting ? "..." : "Add"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categories.map(cat => (<div key={cat.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
            }}>
            <div>
              <span style={{ fontWeight: 500 }}>{cat.name}</span>
              <code style={{ marginLeft: 12, fontSize: "0.8rem", opacity: 0.4 }}>/{cat.slug}</code>
            </div>
            <button onClick={() => handleDelete(cat.id)} style={{
                background: "none",
                border: "none",
                color: "#ff4444",
                cursor: "pointer",
                fontSize: "0.85rem",
                opacity: 0.7,
            }}>
              Remove
            </button>
          </div>))}
      </div>
    </div>);
}
