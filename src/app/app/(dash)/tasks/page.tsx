'use client';

import { useEffect, useState } from 'react';
import { Button, Modal } from '@/components/ui';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'med' | 'low';
  owner: 'mers' | 'user';
  column: 'suggested' | 'backlog' | 'progress' | 'done';
  impact: string | null;
  createdAt: string;
}

const columns = [
  { id: 'suggested', label: 'Suggested', color: 'var(--purple)' },
  { id: 'backlog', label: 'Backlog', color: 'var(--orange)' },
  { id: 'progress', label: 'In Progress', color: 'var(--accent)' },
  { id: 'done', label: 'Done', color: 'var(--green)' },
];

const mockTasks: Task[] = [
  {id:'1',title:'Add urgency timer to product page',description:'CR below 1.2%. Countdown + low-stock badge could lift CR 15-30% (4 creator consensus).',priority:'high',owner:'mers',column:'suggested',impact:'↑ Est. +22% CR',createdAt:new Date().toISOString()},
  {id:'2',title:'Switch to broad targeting on Meta',description:'Interest-stack CPM at $38. Broad + Advantage+ drops CPM to $18-24.',priority:'high',owner:'mers',column:'suggested',impact:'↓ Est. -35% CPM',createdAt:new Date().toISOString()},
  {id:'3',title:'Add Klarna / Afterpay',description:'AOV $39 = BNPL sweet spot. 3 sources confirm 12-18% AOV lift for sub-$50.',priority:'med',owner:'mers',column:'suggested',impact:'↑ Est. +15% AOV',createdAt:new Date().toISOString()},
  {id:'4',title:'Launch TikTok Ads — organic-style hooks',description:'TikTok CPMs 40-60% lower than Meta for fitness/beauty. Test 3 native-feel creatives.',priority:'high',owner:'mers',column:'suggested',impact:'↓ Est. -45% CPM',createdAt:new Date().toISOString()},
  {id:'5',title:'Build email welcome flow',description:'No post-purchase sequence. Klaviyo 3-email flow recovers 8-12% of abandoners.',priority:'high',owner:'mers',column:'backlog',impact:'↑ Est. +$4.2K/mo recovered',createdAt:new Date().toISOString()},
  {id:'6',title:'Test UGC-style creatives',description:'Studio-shot ads underperforming. UGC hooks convert 2-3x on fitness/beauty (5/5 consensus).',priority:'med',owner:'user',column:'backlog',impact:'↑ Est. +2.5x CTR',createdAt:new Date().toISOString()},
  {id:'7',title:'Evaluate CJ Dropshipping vs Teemdrop',description:'Compare shipping times, costs, reliability for EU fulfillment.',priority:'low',owner:'mers',column:'backlog',impact:'↓ Est. -$1.80/order shipping',createdAt:new Date().toISOString()},
  {id:'8',title:'Set up Google Merchant Center',description:'Free Shopping listings + Performance Max for discovery traffic.',priority:'low',owner:'mers',column:'backlog',impact:'↑ Est. +8% organic traffic',createdAt:new Date().toISOString()},
  {id:'9',title:'Scale TikTok Ads to $500/day',description:'Current spend $120/day with 2.8x ROAS. Scaling plan: increase 20% every 48h if ROAS holds above 2.0x.',priority:'high',owner:'mers',column:'progress',impact:'↑ Est. +$8K/mo revenue',createdAt:new Date().toISOString()},
  {id:'10',title:'Meta Ads campaign restructure',description:'Splitting into CBO broad + 3 ASC creatives. Kill: pause if CPP > $25 after 72h.',priority:'high',owner:'mers',column:'progress',impact:'↓ Est. -$8K/mo wasted spend',createdAt:new Date().toISOString()},
  {id:'11',title:'Competitor price monitoring',description:'Tracking 12 products on AliExpress, Amazon, competitor stores. Alert on >10% changes.',priority:'med',owner:'mers',column:'progress',impact:null,createdAt:new Date().toISOString()},
  {id:'12',title:'Creator content ingestion',description:'Processing 47 YouTube videos from top ecom creators. Extracting tactics & decision rules.',priority:'med',owner:'mers',column:'progress',impact:'↑ 89 new tactics extracted',createdAt:new Date().toISOString()},
  {id:'13',title:'Store audit — slimnfit.store',description:'Full conversion audit complete. 14 issues found, 8 critical.',priority:'high',owner:'mers',column:'done',impact:null,createdAt:new Date().toISOString()},
  {id:'14',title:'Market research synthesis',description:'AI-retail TAM $55B by 2030. Dropshipping $1.25T GMV. Landscape mapped.',priority:'med',owner:'mers',column:'done',impact:null,createdAt:new Date().toISOString()},
  {id:'15',title:'Set up Winning Hunter tracking',description:'Product tracker for top 5 niches. Daily alerts configured.',priority:'low',owner:'user',column:'done',impact:null,createdAt:new Date().toISOString()},
  {id:'16',title:'Deploy demo UI prototype',description:'6-tab dashboard: Tasks, Knowledge, Playbooks, Cash Flow, Analytics, Integrations.',priority:'high',owner:'mers',column:'done',impact:null,createdAt:new Date().toISOString()},
  {id:'17',title:'Analyze top 20 Meta Ad Library creatives',description:'Deconstructed hooks, CTAs, formats for fitness/slimming niche.',priority:'med',owner:'mers',column:'done',impact:null,createdAt:new Date().toISOString()},
  {id:'18',title:'Configure Shopify analytics tracking',description:'UTM parameters, FB pixel, conversion API setup verified.',priority:'low',owner:'user',column:'done',impact:null,createdAt:new Date().toISOString()},
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mers' | 'user'>('all');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    // Fetch tasks from API
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        const apiTasks = Array.isArray(data.tasks) ? data.tasks : null;
        setTasks(apiTasks && apiTasks.length > 0 ? apiTasks : mockTasks);
      })
      .catch(() => setTasks(mockTasks));
  }, []);

  const filteredTasks = ownerFilter === 'all' ? tasks : tasks.filter((t) => t.owner === ownerFilter);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTask ? { ...t, column: columnId as Task['column'] } : t))
    );

    // Update on server
    fetch(`/api/tasks/${draggedTask}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column: columnId }),
    });

    setDraggedTask(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <Button onClick={() => setShowNewTaskModal(true)}>+ New task</Button>
        <Button
          variant="ghost"
          size="sm"
          className={ownerFilter === 'all' ? 'active-period' : ''}
          onClick={() => setOwnerFilter('all')}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={ownerFilter === 'mers' ? 'active-period' : ''}
          onClick={() => setOwnerFilter('mers')}
        >
          🤖 Mers
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={ownerFilter === 'user' ? 'active-period' : ''}
          onClick={() => setOwnerFilter('user')}
        >
          👤 Aldiyar
        </Button>
      </div>

      <div className="kanban">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.column === col.id);
          return (
            <div key={col.id} className="kanban-col">
              <div className="col-header">
                <div className="col-title">
                  <div className="col-dot" style={{ background: col.color }}></div>
                  {col.label}
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="col-count">{colTasks.length}</div>
                  <button className="col-add" onClick={() => setShowNewTaskModal(true)}>
                    +
                  </button>
                </div>
              </div>
              <div
                className="kanban-drop"
                data-col={col.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
              >
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="card"
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="card-title">
                      <span className={`card-priority ${task.priority}`}></span>
                      {task.title}
                    </div>
                    {task.description && <div className="card-desc">{task.description}</div>}
                    <div className="card-meta">
                      <span className={`card-tag ${task.owner === 'mers' ? 'tag-agent' : 'tag-human'}`}>
                        {task.owner === 'mers' ? '🤖 Mers' : '👤 Aldiyar'}
                      </span>
                      <span className="card-time">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {task.impact && <div className="card-impact">{task.impact}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      <Modal isOpen={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} title="+ New Task">
        <NewTaskForm
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={(newTask) => {
            setTasks((prev) => [...prev, newTask]);
            setShowNewTaskModal(false);
          }}
        />
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask.title}>
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDelete={(id) => {
              setTasks((prev) => prev.filter((t) => t.id !== id));
              setSelectedTask(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function NewTaskForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (task: Task) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'med' | 'low'>('med');
  const [owner, setOwner] = useState<'mers' | 'user'>('mers');
  const [column, setColumn] = useState<'suggested' | 'backlog' | 'progress' | 'done'>('backlog');

  const handleSubmit = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title || 'New task',
      description: description || null,
      priority,
      owner,
      column,
      impact: null,
      createdAt: new Date().toISOString(),
    };

    // Save to API
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    onSubmit(newTask);
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', marginTop: '12px' }}>
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        style={{ width: '100%', padding: '8px 12px' }}
      />

      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', marginTop: '12px' }}>
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Details, context, expected impact..."
        style={{ width: '100%', padding: '8px 12px', minHeight: '60px', resize: 'vertical' }}
      />

      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', marginTop: '12px' }}>
        Priority
      </label>
      <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} style={{ width: '100%', padding: '8px 12px' }}>
        <option value="high">🔴 High</option>
        <option value="med">🟡 Medium</option>
        <option value="low">🔵 Low</option>
      </select>

      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', marginTop: '12px' }}>
        Assign to
      </label>
      <select value={owner} onChange={(e) => setOwner(e.target.value as Task['owner'])} style={{ width: '100%', padding: '8px 12px' }}>
        <option value="mers">🤖 Mers</option>
        <option value="user">👤 Aldiyar</option>
      </select>

      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', marginTop: '12px' }}>
        Column
      </label>
      <select value={column} onChange={(e) => setColumn(e.target.value as Task['column'])} style={{ width: '100%', padding: '8px 12px' }}>
        {columns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add task</Button>
      </div>
    </div>
  );
}

function TaskDetail({
  task,
  onClose,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '12px' }}>
        {task.description}
      </p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
        <span className={`card-tag ${task.owner === 'mers' ? 'tag-agent' : 'tag-human'}`}>
          {task.owner === 'mers' ? '🤖 Mers' : '👤 Aldiyar'}
        </span>
        <span className={`card-priority ${task.priority}`} style={{ width: '8px', height: '8px' }}></span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {task.priority} priority · {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
      {task.impact && (
        <div className="card-impact" style={{ marginBottom: '12px' }}>
          {task.impact}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
