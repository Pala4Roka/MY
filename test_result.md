#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Задачи по улучшению сайта Eternal Sentinels (Второй этап):
  1) ✅ Изменить размер видео в окне MAL0, чтобы оно полностью поместилось
  2) ✅ Добавить кнопку "все объекты" с круговым меню уровней опасности
  3) ✅ Убрать кнопку для включения/отключения анимации заднего фона
  4) ✅ Изменить анимацию заднего фона на SCP-тематику
  5) ✅ Объекты уже отсортированы по номерам (0000, 0002, 0003, 0004...)
  6) ✅ Создать документ с фишками сайта (SITE_FEATURES.md)

backend:
  - task: "Данные уже упорядочены в scp_data.py"
    implemented: true
    working: true
    file: "/app/backend/scp_data.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Объекты уже отсортированы по номерам (0000, 0002, 0003, 0004...) в scp_data.py"

frontend:
  - task: "Убрать надпись о рандомности в карусели"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/DossierCarousel.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Изменена надпись с 'РАНДОМНЫЕ ДОСЬЕ' на 'ИЗБРАННЫЕ ДОСЬЕ', убрана строка 'Автоматическая ротация каждые 5 секунд'"

  - task: "Исправить прокрутку страницы при отправке сообщения в чате"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/ChatInterface.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Изменена функция scrollToBottom для прокрутки только внутри контейнера чата, а не всей страницы"

  - task: "Убрать черные линии в окне MAL0"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/VideoBackground.css"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Изменен object-fit с 'contain' на 'cover' и добавлен object-position: center для убирания черных полос"

  - task: "Переместить кнопки управления аватаркой"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/ProfilePage.js, /app/frontend/src/pages/ProfilePage.css"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Кнопки перенесены из avatar-upload-btn в новый контейнер avatar-controls под аватаркой, обновлены стили для кнопок"

  - task: "Добавить анимированный фон"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/AnimatedBackground.js, /app/frontend/src/components/AnimatedBackground.css, /app/frontend/src/App.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Создан компонент AnimatedBackground с частицами, светящимися сферами и сеткой. Добавлен в App.js с условием отключения для администраторов (clearance_level >= 5)"

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Упорядочить досье в scp_data.py по номерам"
    - "Изменить текст ошибки AI на 'MAL0'"
    - "Убрать надпись о рандомности в карусели"
    - "Исправить прокрутку страницы при отправке сообщения в чате"
    - "Убрать черные линии в окне MAL0"
    - "Переместить кнопки управления аватаркой"
    - "Добавить анимированный фон"
  stuck_tasks: []
  test_all: true
  test_priority: "sequential"

agent_communication:
  - agent: "main"
    message: |
      Выполнены все запрошенные задачи:
      
      Backend:
      1. ✅ Упорядочены досье в scp_data.py по номерам (0000, 0002, 0003, 0004...)
      2. ✅ Изменено сообщение об ошибке AI на "MAL0"
      3. ✅ Добавлен EMERGENT_LLM_KEY в .env для работы AI
      
      Frontend:
      4. ✅ Изменена надпись карусели на "ИЗБРАННЫЕ ДОСЬЕ", убрана строка о рандомности
      5. ✅ Исправлена прокрутка страницы при отправке сообщения в чате
      6. ✅ Убраны черные линии в окне MAL0 (изменен object-fit)
      7. ✅ Кнопки управления аватаркой перенесены под аватарку
      8. ✅ Добавлен анимированный фон с автоматическим отключением для администраторов
      
      Все изменения применены. Требуется тестирование.
