#!/bin/bash
# ============================================================
# opencod3 Agent Runner
# Usage: ./run-agents.sh .tasks/<task-file>.md
#        ./run-agents.sh .tasks/<task-file>.md --skip-tests
# ============================================================

set -e

TASK_FILE=$1
SKIP_TESTS=$2

# ── Validation ───────────────────────────────────────────────
if [ -z "$TASK_FILE" ]; then
  echo "❌ Usage: ./run-agents.sh .tasks/<task-file>.md"
  exit 1
fi

if [ ! -f "$TASK_FILE" ]; then
  echo "❌ Task file not found: $TASK_FILE"
  exit 1
fi

TASK_NAME=$(basename "$TASK_FILE" .md)
LOG_FILE=".agents/logs/${TASK_NAME}-$(date +%Y%m%d-%H%M%S).log"
mkdir -p .agents/logs

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║         opencod3 Agent Orchestrator              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📋 Task:   $TASK_FILE"
echo "📝 Log:    $LOG_FILE"
echo ""

# ── Phase 1: Scaffold NestJS Backend ─────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  PHASE 1 — Scaffold NestJS Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

opencode run \
  --system-prompt .agents/scaffold.md \
  --input "$(cat $TASK_FILE)" \
  --cwd ./backend \
  2>&1 | tee -a "$LOG_FILE"

echo ""
echo "✅ Phase 1 complete"
echo ""

# ── Phase 2: Generate React Frontend ─────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚛️  PHASE 2 — Generate React Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

opencode run \
  --system-prompt .agents/react.md \
  --input "$(cat $TASK_FILE)" \
  --cwd ./frontend \
  2>&1 | tee -a "$LOG_FILE"

echo ""
echo "✅ Phase 2 complete"
echo ""

# ── Phase 3: Review & Fix ─────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PHASE 3 — Review & Auto-Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || echo "all recently created files")

opencode run \
  --system-prompt .agents/reviewer.md \
  --input "Review all files changed in this task. Changed files: $CHANGED_FILES. Task context: $(cat $TASK_FILE)" \
  --cwd . \
  2>&1 | tee -a "$LOG_FILE"

echo ""
echo "✅ Phase 3 complete"
echo ""

# ── Phase 4: Write Tests ──────────────────────────────────────
if [ "$SKIP_TESTS" != "--skip-tests" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🧪 PHASE 4 — Write Tests"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  opencode run \
    --system-prompt .agents/tester.md \
    --input "Write tests for all files changed in this task. Changed files: $CHANGED_FILES. Task context: $(cat $TASK_FILE)" \
    --cwd . \
    2>&1 | tee -a "$LOG_FILE"

  echo ""
  echo "✅ Phase 4 complete"
  echo ""
fi

# ── Summary ───────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════╗"
echo "║                    DONE ✅                       ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📝 Full log saved to: $LOG_FILE"
echo "🔍 Review changes:    git diff"
echo "🚀 Run dev:           ./dev.sh"
echo ""