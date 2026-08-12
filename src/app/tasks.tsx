import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  AlertCircle,
  Droplets,
  Sprout,
  ShieldAlert,
  Search,
  X,
  Filter,
} from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { INITIAL_TASKS, INITIAL_FIELDS, FarmTask } from '@/services/farmStore';

export default function TasksScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [tasks, setTasks] = useState<FarmTask[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'high' | 'completed'>('all');
  const [modalVisible, setModalVisible] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [fieldId, setFieldId] = useState(INITIAL_FIELDS[0]?.id || '');
  const [type, setType] = useState<FarmTask['type']>('irrigation');
  const [priority, setPriority] = useState<FarmTask['priority']>('medium');
  const [dueDate, setDueDate] = useState('Tomorrow');

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  const handleAddTask = () => {
    if (!title) {
      Alert.alert('Title Required', 'Please enter a task title.');
      return;
    }

    const selectedField = INITIAL_FIELDS.find((f) => f.id === fieldId);

    const newTask: FarmTask = {
      id: `task-${Date.now()}`,
      title,
      fieldId: fieldId || 'field-1',
      fieldName: selectedField?.name || 'General Farm',
      type,
      priority,
      dueDate,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setModalVisible(false);
    setTitle('');
  };

  const getTypeIcon = (taskType: FarmTask['type']) => {
    switch (taskType) {
      case 'irrigation':
        return <Droplets size={16} color="#0284C7" />;
      case 'pest_control':
        return <ShieldAlert size={16} color="#EF4444" />;
      case 'harvest':
        return <Sprout size={16} color="#16A34A" />;
      default:
        return <Calendar size={16} color="#D97706" />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Farm Operations</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {tasks.filter((t) => !t.completed).length} pending tasks •{' '}
              {tasks.filter((t) => t.priority === 'high' && !t.completed).length} urgent
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}>
            <Plus size={18} color="#ffffff" />
            <Text style={styles.addBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'high', label: 'High Priority 🔥' },
            { id: 'completed', label: 'Completed' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setFilter(item.id as any)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filter === item.id ? colors.primary : colors.backgroundElement,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text
                style={[
                  styles.filterText,
                  { color: filter === item.id ? '#ffffff' : colors.textSecondary },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task Cards */}
        {filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => toggleTask(task.id)}
            style={[
              styles.taskCard,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.cardBorder,
                opacity: task.completed ? 0.6 : 1,
              },
            ]}>
            <View style={styles.taskCardLeft}>
              <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkboxTouch}>
                {task.completed ? (
                  <CheckCircle2 size={24} color={colors.primary} />
                ) : (
                  <Circle size={24} color={colors.textSecondary} />
                )}
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: colors.text,
                      textDecorationLine: task.completed ? 'line-through' : 'none',
                    },
                  ]}>
                  {task.title}
                </Text>

                <View style={styles.taskMetaRow}>
                  <View style={styles.typeBadge}>
                    {getTypeIcon(task.type)}
                    <Text style={[styles.typeText, { color: colors.textSecondary }]}>
                      {task.type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>

                  <Text style={[styles.dotSep, { color: colors.textSecondary }]}>•</Text>

                  <Text style={[styles.taskField, { color: colors.textSecondary }]}>
                    {task.fieldName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.taskCardRight}>
              <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
                {task.dueDate}
              </Text>

              {task.priority === 'high' && !task.completed && (
                <View style={[styles.prioBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={styles.prioText}>HIGH</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Schedule Farm Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Task Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.cardBorder },
              ]}
              placeholder="e.g. Inspect tomato drip irrigation line"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Operation Type</Text>
            <View style={styles.typeSelector}>
              {(['irrigation', 'fertilizer', 'pest_control', 'harvest'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: type === t ? colors.primary : colors.background,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                  <Text style={{ color: type === t ? '#ffffff' : colors.text, fontSize: 11, fontWeight: '700' }}>
                    {t.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Priority Level</Text>
            <View style={styles.typeSelector}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: priority === p ? (p === 'high' ? '#EF4444' : colors.primary) : colors.background,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                  <Text style={{ color: priority === p ? '#ffffff' : colors.text, fontSize: 11, fontWeight: '700' }}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddTask}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.submitBtnText}>Save Schedule Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.three,
    paddingTop: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.three,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  taskCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkboxTouch: {
    padding: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dotSep: {
    fontSize: 12,
  },
  taskField: {
    fontSize: 11,
  },
  taskCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dueDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  prioBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  prioText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: Spacing.four,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  submitBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: Spacing.four,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
