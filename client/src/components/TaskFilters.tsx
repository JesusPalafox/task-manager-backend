import type { TaskQuery } from '../types';
interface Props { query: TaskQuery; onChange: (value: TaskQuery) => void; total: number }
export function TaskFilters({ query, onChange, total }: Props) {
  const change = (patch: Partial<TaskQuery>) => onChange({ ...query, ...patch, page: 1 });
  return <section className="panel"><h2>Buscar y filtrar</h2>
    <div className="filter-grid">
      <label>Buscar
        <input value={query.search ?? ''} maxLength={80}
          onChange={e => change({ search: e.target.value })} placeholder="Buscar título" /></label>
      <label>Estado
        <select value={query.status ?? 'all'} onChange={e => change({
          status: e.target.value === 'all' ? undefined : e.target.value as TaskQuery['status'],
        })}>
          <option value="all">Todos</option><option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select></label>
      <label>Ordenar por
        <select value={query.sortBy} onChange={e => change({ sortBy: e.target.value as TaskQuery['sortBy'] })}>
          <option value="createdAt">Creación</option><option value="updatedAt">Actualización</option>
          <option value="title">Título</option><option value="status">Estado</option>
        </select></label>
      <label>Dirección
        <select value={query.order} onChange={e => change({ order: e.target.value as TaskQuery['order'] })}>
          <option value="asc">Ascendente</option><option value="desc">Descendente</option>
        </select></label>
      <label>Por página
        <select value={query.limit} onChange={e => change({ limit: Number(e.target.value) })}>
          <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </select></label>
    </div>
    <p>Total de tareas encontradas: {total}</p>
  </section>;
}
