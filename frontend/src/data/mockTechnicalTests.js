/**
 * Mock technical tests data with complete questions and answers
 * Each test has 20 questions with multiple choice answers
 */

export const mockTechnicalTests = {
    // Python Fundamentals Test
    python: {
        id: 1,
        test_name: 'Python Fundamentals Test',
        skill: { name: 'Python', category: 'programming' },
        description: 'Master the basics of Python programming',
        difficulty: 'Beginner',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is the correct way to create a list in Python?",
                options: [
                    "list = []",
                    "list = list()",
                    "list = [] or list = list()",
                    "list = new list()"
                ],
                correct_answer: 2,
                explanation: "Both list = [] and list = list() are correct ways to create an empty list in Python."
            },
            {
                id: 2,
                question: "Which keyword is used to define a function in Python?",
                options: [
                    "function",
                    "def",
                    "func",
                    "define"
                ],
                correct_answer: 1,
                explanation: "The 'def' keyword is used to define a function in Python."
            },
            {
                id: 3,
                question: "What will be the output of: print(3 * 2 + 1)?",
                options: [
                    "7",
                    "9",
                    "6",
                    "8"
                ],
                correct_answer: 0,
                explanation: "Following order of operations: 3 * 2 = 6, then 6 + 1 = 7"
            },
            {
                id: 4,
                question: "Which data type is mutable in Python?",
                options: [
                    "tuple",
                    "string",
                    "list",
                    "int"
                ],
                correct_answer: 2,
                explanation: "Lists are mutable, meaning their contents can be changed after creation."
            },
            {
                id: 5,
                question: "What is the correct syntax for a for loop in Python?",
                options: [
                    "for i in range(5):",
                    "for (i = 0; i < 5; i++)",
                    "for i in 5:",
                    "for i = 0 to 5:"
                ],
                correct_answer: 0,
                explanation: "Python uses 'for i in range(5):' syntax for loops."
            },
            {
                id: 6,
                question: "What is the output of: print('Hello' + 'World')?",
                options: [
                    "HelloWorld",
                    "Hello World",
                    "Hello+World",
                    "Error"
                ],
                correct_answer: 0,
                explanation: "String concatenation in Python uses the + operator without spaces."
            },
            {
                id: 7,
                question: "Which of the following is NOT a Python data type?",
                options: [
                    "list",
                    "dictionary",
                    "array",
                    "tuple"
                ],
                correct_answer: 2,
                explanation: "Python has lists, not arrays. Lists are more flexible than arrays."
            },
            {
                id: 8,
                question: "What does len() function do in Python?",
                options: [
                    "Returns the length of a string",
                    "Returns the length of a list",
                    "Returns the length of any sequence",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "len() returns the length of strings, lists, tuples, and other sequences."
            },
            {
                id: 9,
                question: "Which operator is used for exponentiation in Python?",
                options: [
                    "^",
                    "**",
                    "pow()",
                    "Both ** and pow()"
                ],
                correct_answer: 3,
                explanation: "Python uses ** for exponentiation and also has a pow() function."
            },
            {
                id: 10,
                question: "What is the correct way to create a dictionary in Python?",
                options: [
                    "dict = {}",
                    "dict = dict()",
                    "dict = {'key': 'value'}",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "All three methods are correct ways to create dictionaries in Python."
            },
            {
                id: 11,
                question: "What will be the output of: print(10 // 3)?",
                options: [
                    "3.33",
                    "3",
                    "3.0",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "// is the floor division operator, returning the integer part of division."
            },
            {
                id: 12,
                question: "Which statement is used to handle exceptions in Python?",
                options: [
                    "try-except",
                    "try-catch",
                    "if-else",
                    "switch-case"
                ],
                correct_answer: 0,
                explanation: "Python uses try-except blocks for exception handling."
            },
            {
                id: 13,
                question: "What is the output of: print(range(5))?",
                options: [
                    "[0, 1, 2, 3, 4]",
                    "range(0, 5)",
                    "0 1 2 3 4",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "range() returns a range object, not a list."
            },
            {
                id: 14,
                question: "Which method is used to add an item to a list?",
                options: [
                    "add()",
                    "append()",
                    "insert()",
                    "Both append() and insert()"
                ],
                correct_answer: 3,
                explanation: "append() adds to the end, insert() adds at a specific position."
            },
            {
                id: 15,
                question: "What is the output of: print('Python'[1:4])?",
                options: [
                    "Pyt",
                    "yth",
                    "ytho",
                    "Python"
                ],
                correct_answer: 1,
                explanation: "String slicing [1:4] returns characters from index 1 to 3 (exclusive)."
            },
            {
                id: 16,
                question: "Which keyword is used to define a class in Python?",
                options: [
                    "class",
                    "def",
                    "function",
                    "object"
                ],
                correct_answer: 0,
                explanation: "The 'class' keyword is used to define classes in Python."
            },
            {
                id: 17,
                question: "What is the output of: print(bool(''))?",
                options: [
                    "True",
                    "False",
                    "Error",
                    "None"
                ],
                correct_answer: 1,
                explanation: "Empty strings are considered False in boolean context."
            },
            {
                id: 18,
                question: "Which function is used to get user input in Python?",
                options: [
                    "input()",
                    "get_input()",
                    "read()",
                    "scan()"
                ],
                correct_answer: 0,
                explanation: "input() is the built-in function to get user input in Python."
            },
            {
                id: 19,
                question: "What is the output of: print(2 ** 3)?",
                options: [
                    "6",
                    "8",
                    "9",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "2 ** 3 means 2 raised to the power of 3, which equals 8."
            },
            {
                id: 20,
                question: "Which statement is used to exit a loop in Python?",
                options: [
                    "break",
                    "exit",
                    "stop",
                    "end"
                ],
                correct_answer: 0,
                explanation: "break is used to exit a loop prematurely in Python."
            }
        ]
    },

    // JavaScript Essentials Test
    javascript: {
        id: 2,
        test_name: 'JavaScript Essentials Test',
        skill: { name: 'JavaScript', category: 'programming' },
        description: 'Essential JavaScript concepts and syntax',
        difficulty: 'Intermediate',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is the correct way to declare a variable in JavaScript?",
                options: [
                    "var name = 'John';",
                    "let name = 'John';",
                    "const name = 'John';",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "var, let, and const are all valid ways to declare variables in JavaScript."
            },
            {
                id: 2,
                question: "What will be the output of: console.log(typeof null)?",
                options: [
                    "null",
                    "undefined",
                    "object",
                    "string"
                ],
                correct_answer: 2,
                explanation: "typeof null returns 'object' due to a historical bug in JavaScript."
            },
            {
                id: 3,
                question: "Which method is used to add an element to the end of an array?",
                options: [
                    "push()",
                    "pop()",
                    "shift()",
                    "unshift()"
                ],
                correct_answer: 0,
                explanation: "push() adds elements to the end of an array."
            },
            {
                id: 4,
                question: "What is the result of: 5 + '5' in JavaScript?",
                options: [
                    "10",
                    "55",
                    "Error",
                    "undefined"
                ],
                correct_answer: 1,
                explanation: "JavaScript performs type coercion, converting 5 to string and concatenating."
            },
            {
                id: 5,
                question: "Which keyword is used to create a function in JavaScript?",
                options: [
                    "function",
                    "def",
                    "func",
                    "create"
                ],
                correct_answer: 0,
                explanation: "The 'function' keyword is used to declare functions in JavaScript."
            },
            {
                id: 6,
                question: "What is the output of: console.log(0.1 + 0.2)?",
                options: [
                    "0.3",
                    "0.30000000000000004",
                    "0.33",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "Floating point arithmetic can produce unexpected results due to precision issues."
            },
            {
                id: 7,
                question: "Which method is used to remove the last element from an array?",
                options: [
                    "remove()",
                    "pop()",
                    "delete()",
                    "splice()"
                ],
                correct_answer: 1,
                explanation: "pop() removes and returns the last element of an array."
            },
            {
                id: 8,
                question: "What is the difference between == and === in JavaScript?",
                options: [
                    "No difference",
                    "== checks value, === checks value and type",
                    "=== is faster",
                    "== is deprecated"
                ],
                correct_answer: 1,
                explanation: "== performs type coercion, === checks both value and type."
            },
            {
                id: 9,
                question: "Which keyword is used to declare a constant in JavaScript?",
                options: [
                    "const",
                    "let",
                    "var",
                    "final"
                ],
                correct_answer: 0,
                explanation: "const is used to declare constants in JavaScript."
            },
            {
                id: 10,
                question: "What is the output of: console.log(typeof [])?",
                options: [
                    "array",
                    "object",
                    "list",
                    "undefined"
                ],
                correct_answer: 1,
                explanation: "Arrays are objects in JavaScript, so typeof [] returns 'object'."
            },
            {
                id: 11,
                question: "Which method is used to join array elements into a string?",
                options: [
                    "join()",
                    "concat()",
                    "toString()",
                    "stringify()"
                ],
                correct_answer: 0,
                explanation: "join() converts array elements to a string with optional separator."
            },
            {
                id: 12,
                question: "What is the output of: console.log(1 + 2 + '3')?",
                options: [
                    "6",
                    "33",
                    "123",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "Addition is left-associative, so 1+2=3, then 3+'3'='33'."
            },
            {
                id: 13,
                question: "Which statement is used to handle errors in JavaScript?",
                options: [
                    "try-catch",
                    "try-except",
                    "if-else",
                    "switch-case"
                ],
                correct_answer: 0,
                explanation: "JavaScript uses try-catch blocks for error handling."
            },
            {
                id: 14,
                question: "What is the output of: console.log(Boolean(''))?",
                options: [
                    "true",
                    "false",
                    "undefined",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "Empty strings are falsy in JavaScript, so Boolean('') returns false."
            },
            {
                id: 15,
                question: "Which method is used to find an element in an array?",
                options: [
                    "find()",
                    "search()",
                    "locate()",
                    "indexOf()"
                ],
                correct_answer: 0,
                explanation: "find() returns the first element that satisfies the testing function."
            },
            {
                id: 16,
                question: "What is the output of: console.log(typeof function(){})?",
                options: [
                    "function",
                    "object",
                    "undefined",
                    "Error"
                ],
                correct_answer: 0,
                explanation: "Functions have their own type in JavaScript."
            },
            {
                id: 17,
                question: "Which operator is used for strict equality in JavaScript?",
                options: [
                    "==",
                    "===",
                    "=",
                    "!="
                ],
                correct_answer: 1,
                explanation: "=== is the strict equality operator that checks both value and type."
            },
            {
                id: 18,
                question: "What is the output of: console.log(2 + 3 * 4)?",
                options: [
                    "20",
                    "14",
                    "24",
                    "Error"
                ],
                correct_answer: 1,
                explanation: "Multiplication has higher precedence, so 3*4=12, then 2+12=14."
            },
            {
                id: 19,
                question: "Which method is used to create a new array from an existing one?",
                options: [
                    "map()",
                    "forEach()",
                    "filter()",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "map(), forEach(), and filter() all create new arrays from existing ones."
            },
            {
                id: 20,
                question: "What is the output of: console.log(typeof undefined)?",
                options: [
                    "undefined",
                    "object",
                    "null",
                    "Error"
                ],
                correct_answer: 0,
                explanation: "typeof undefined returns 'undefined'."
            }
        ]
    },

    // React Components Test
    react: {
        id: 3,
        test_name: 'React Components Test',
        skill: { name: 'React', category: 'frontend' },
        description: 'React components, hooks, and lifecycle',
        difficulty: 'Intermediate',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is JSX in React?",
                options: [
                    "A JavaScript extension that allows HTML-like syntax",
                    "A separate templating language",
                    "A CSS preprocessor",
                    "A build tool"
                ],
                correct_answer: 0,
                explanation: "JSX is a JavaScript extension that allows you to write HTML-like syntax in JavaScript."
            },
            {
                id: 2,
                question: "Which hook is used to manage state in functional components?",
                options: [
                    "useState",
                    "useEffect",
                    "useContext",
                    "useReducer"
                ],
                correct_answer: 0,
                explanation: "useState is the primary hook for managing state in functional components."
            },
            {
                id: 3,
                question: "What is the correct way to create a functional component in React?",
                options: [
                    "function MyComponent() { return <div>Hello</div>; }",
                    "const MyComponent = () => { return <div>Hello</div>; }",
                    "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "All three methods are valid ways to create React components."
            },
            {
                id: 4,
                question: "Which lifecycle method is called after a component mounts?",
                options: [
                    "componentDidMount",
                    "componentWillMount",
                    "componentDidUpdate",
                    "componentWillUnmount"
                ],
                correct_answer: 0,
                explanation: "componentDidMount is called after a component is mounted to the DOM."
            },
            {
                id: 5,
                question: "What is the purpose of the useEffect hook?",
                options: [
                    "To manage state",
                    "To perform side effects",
                    "To create refs",
                    "To handle events"
                ],
                correct_answer: 1,
                explanation: "useEffect is used to perform side effects in functional components."
            },
            {
                id: 6,
                question: "What is the correct way to pass props to a component?",
                options: [
                    "<Component prop={value} />",
                    "<Component prop=value />",
                    "<Component prop:value />",
                    "<Component prop->value</Component>"
                ],
                correct_answer: 0,
                explanation: "Props are passed as attributes with curly braces for JavaScript expressions."
            },
            {
                id: 7,
                question: "Which method is used to update state in a class component?",
                options: [
                    "this.setState()",
                    "this.updateState()",
                    "this.changeState()",
                    "this.modifyState()"
                ],
                correct_answer: 0,
                explanation: "this.setState() is used to update state in class components."
            },
            {
                id: 8,
                question: "What is the purpose of keys in React lists?",
                options: [
                    "To improve performance",
                    "To identify unique elements",
                    "To sort the list",
                    "Both A and B"
                ],
                correct_answer: 3,
                explanation: "Keys help React identify which items have changed and improve performance."
            },
            {
                id: 9,
                question: "Which hook is used to access context in functional components?",
                options: [
                    "useContext",
                    "useContextValue",
                    "useContextData",
                    "useContextState"
                ],
                correct_answer: 0,
                explanation: "useContext is the hook used to access context in functional components."
            },
            {
                id: 10,
                question: "What is the purpose of useMemo hook?",
                options: [
                    "To manage state",
                    "To perform side effects",
                    "To memoize expensive calculations",
                    "To handle events"
                ],
                correct_answer: 2,
                explanation: "useMemo is used to memoize expensive calculations and optimize performance."
            },
            {
                id: 11,
                question: "Which lifecycle method is called before a component unmounts?",
                options: [
                    "componentWillUnmount",
                    "componentDidUnmount",
                    "componentBeforeUnmount",
                    "componentWillRemove"
                ],
                correct_answer: 0,
                explanation: "componentWillUnmount is called before a component is removed from the DOM."
            },
            {
                id: 12,
                question: "What is the purpose of useCallback hook?",
                options: [
                    "To create callbacks",
                    "To memoize functions",
                    "To handle clicks",
                    "To manage state"
                ],
                correct_answer: 1,
                explanation: "useCallback is used to memoize functions and prevent unnecessary re-renders."
            },
            {
                id: 13,
                question: "Which method is used to handle form submissions in React?",
                options: [
                    "onSubmit",
                    "onFormSubmit",
                    "onHandleSubmit",
                    "onFormHandle"
                ],
                correct_answer: 0,
                explanation: "onSubmit is the standard event handler for form submissions in React."
            },
            {
                id: 14,
                question: "What is the purpose of React.Fragment?",
                options: [
                    "To group elements without adding extra nodes",
                    "To create fragments",
                    "To split components",
                    "To combine props"
                ],
                correct_answer: 0,
                explanation: "React.Fragment allows grouping elements without adding extra DOM nodes."
            },
            {
                id: 15,
                question: "Which hook is used to manage side effects in functional components?",
                options: [
                    "useEffect",
                    "useSideEffect",
                    "useEffectHook",
                    "useEffectManager"
                ],
                correct_answer: 0,
                explanation: "useEffect is the primary hook for managing side effects in functional components."
            },
            {
                id: 16,
                question: "What is the purpose of useRef hook?",
                options: [
                    "To create references",
                    "To access DOM elements",
                    "To store mutable values",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "useRef can be used to create references, access DOM elements, and store mutable values."
            },
            {
                id: 17,
                question: "Which method is used to prevent default behavior in React?",
                options: [
                    "event.preventDefault()",
                    "event.stopDefault()",
                    "event.cancelDefault()",
                    "event.blockDefault()"
                ],
                correct_answer: 0,
                explanation: "event.preventDefault() is used to prevent the default behavior of an event."
            },
            {
                id: 18,
                question: "What is the purpose of React.memo?",
                options: [
                    "To create memoized components",
                    "To optimize performance",
                    "To prevent unnecessary re-renders",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "React.memo creates memoized components that only re-render when props change."
            },
            {
                id: 19,
                question: "Which hook is used to manage complex state logic?",
                options: [
                    "useReducer",
                    "useState",
                    "useComplexState",
                    "useStateManager"
                ],
                correct_answer: 0,
                explanation: "useReducer is used to manage complex state logic with a reducer function."
            },
            {
                id: 20,
                question: "What is the purpose of React.StrictMode?",
                options: [
                    "To enable strict mode",
                    "To identify potential problems",
                    "To activate additional checks",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "React.StrictMode helps identify potential problems and activates additional checks."
            }
        ]
    },

    // Django Framework Test
    django: {
        id: 4,
        test_name: 'Django Framework Test',
        skill: { name: 'Django', category: 'backend' },
        description: 'Django web framework fundamentals',
        difficulty: 'Advanced',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is Django's MVT pattern?",
                options: [
                    "Model-View-Template",
                    "Model-View-Controller",
                    "Model-View-Transaction",
                    "Model-View-Trigger"
                ],
                correct_answer: 0,
                explanation: "Django uses Model-View-Template (MVT) pattern instead of MVC."
            },
            {
                id: 2,
                question: "Which command is used to create a new Django project?",
                options: [
                    "django-admin startproject",
                    "python manage.py startproject",
                    "django startproject",
                    "python django startproject"
                ],
                correct_answer: 0,
                explanation: "django-admin startproject is used to create a new Django project."
            },
            {
                id: 3,
                question: "What is a Django model?",
                options: [
                    "A database table representation",
                    "A view component",
                    "A template file",
                    "A URL pattern"
                ],
                correct_answer: 0,
                explanation: "A Django model is a Python class that represents a database table."
            },
            {
                id: 4,
                question: "Which file contains Django's URL patterns?",
                options: [
                    "urls.py",
                    "views.py",
                    "models.py",
                    "settings.py"
                ],
                correct_answer: 0,
                explanation: "urls.py contains the URL patterns for routing requests to views."
            },
            {
                id: 5,
                question: "What is Django's ORM?",
                options: [
                    "Object-Relational Mapping",
                    "Object-Request Mapping",
                    "Object-Response Mapping",
                    "Object-Route Mapping"
                ],
                correct_answer: 0,
                explanation: "Django's ORM (Object-Relational Mapping) allows database operations using Python objects."
            },
            {
                id: 6,
                question: "Which command is used to create a Django app?",
                options: [
                    "python manage.py startapp",
                    "django-admin startapp",
                    "python manage.py createapp",
                    "django-admin createapp"
                ],
                correct_answer: 0,
                explanation: "python manage.py startapp is used to create a new Django app."
            },
            {
                id: 7,
                question: "What is the purpose of Django migrations?",
                options: [
                    "To track database changes",
                    "To create database tables",
                    "To update database schema",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django migrations track, create, and update database schema changes."
            },
            {
                id: 8,
                question: "Which file contains Django project settings?",
                options: [
                    "settings.py",
                    "config.py",
                    "django_settings.py",
                    "project_settings.py"
                ],
                correct_answer: 0,
                explanation: "settings.py contains all Django project configuration settings."
            },
            {
                id: 9,
                question: "What is Django's admin interface?",
                options: [
                    "A built-in admin panel",
                    "A third-party tool",
                    "A custom interface",
                    "A database viewer"
                ],
                correct_answer: 0,
                explanation: "Django provides a built-in admin interface for managing data."
            },
            {
                id: 10,
                question: "Which method is used to create database migrations?",
                options: [
                    "python manage.py makemigrations",
                    "python manage.py migrate",
                    "python manage.py create_migrations",
                    "python manage.py generate_migrations"
                ],
                correct_answer: 0,
                explanation: "makemigrations creates migration files for model changes."
            },
            {
                id: 11,
                question: "What is the purpose of Django middleware?",
                options: [
                    "To process requests and responses",
                    "To handle authentication",
                    "To manage sessions",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django middleware processes requests, handles auth, and manages sessions."
            },
            {
                id: 12,
                question: "Which template engine does Django use by default?",
                options: [
                    "Jinja2",
                    "Django Templates",
                    "Mako",
                    "Cheetah"
                ],
                correct_answer: 1,
                explanation: "Django uses its own template engine by default."
            },
            {
                id: 13,
                question: "What is the purpose of Django forms?",
                options: [
                    "To handle form data",
                    "To validate input",
                    "To render HTML forms",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django forms handle data, validate input, and render HTML forms."
            },
            {
                id: 14,
                question: "Which command is used to run Django development server?",
                options: [
                    "python manage.py runserver",
                    "django-admin runserver",
                    "python manage.py startserver",
                    "django-admin startserver"
                ],
                correct_answer: 0,
                explanation: "python manage.py runserver starts the Django development server."
            },
            {
                id: 15,
                question: "What is the purpose of Django signals?",
                options: [
                    "To send notifications",
                    "To handle events",
                    "To connect functions",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django signals allow decoupled applications to get notified when certain actions occur."
            },
            {
                id: 16,
                question: "Which file contains Django URL patterns?",
                options: [
                    "urls.py",
                    "routes.py",
                    "paths.py",
                    "endpoints.py"
                ],
                correct_answer: 0,
                explanation: "urls.py contains URL patterns for routing requests to views."
            },
            {
                id: 17,
                question: "What is the purpose of Django's CSRF protection?",
                options: [
                    "To prevent cross-site request forgery",
                    "To secure forms",
                    "To validate tokens",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django's CSRF protection prevents cross-site request forgery attacks."
            },
            {
                id: 18,
                question: "Which method is used to create a superuser in Django?",
                options: [
                    "python manage.py createsuperuser",
                    "django-admin createsuperuser",
                    "python manage.py create_superuser",
                    "django-admin create_superuser"
                ],
                correct_answer: 0,
                explanation: "python manage.py createsuperuser creates a Django superuser account."
            },
            {
                id: 19,
                question: "What is the purpose of Django's cache framework?",
                options: [
                    "To store data temporarily",
                    "To improve performance",
                    "To reduce database queries",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "Django's cache framework stores data temporarily to improve performance."
            },
            {
                id: 20,
                question: "Which decorator is used to require login in Django views?",
                options: [
                    "@login_required",
                    "@require_login",
                    "@authenticated",
                    "@login_only"
                ],
                correct_answer: 0,
                explanation: "@login_required decorator ensures that only logged-in users can access a view."
            }
        ]
    },

    // SQL Database Test
    sql: {
        id: 5,
        test_name: 'SQL Database Test',
        skill: { name: 'SQL', category: 'database' },
        description: 'Database queries and management',
        difficulty: 'Intermediate',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What does SQL stand for?",
                options: [
                    "Structured Query Language",
                    "Standard Query Language",
                    "Simple Query Language",
                    "System Query Language"
                ],
                correct_answer: 0,
                explanation: "SQL stands for Structured Query Language."
            },
            {
                id: 2,
                question: "Which SQL command is used to retrieve data from a database?",
                options: [
                    "SELECT",
                    "GET",
                    "RETRIEVE",
                    "FETCH"
                ],
                correct_answer: 0,
                explanation: "SELECT is used to retrieve data from database tables."
            },
            {
                id: 3,
                question: "What is the purpose of the WHERE clause?",
                options: [
                    "To group data",
                    "To filter data",
                    "To sort data",
                    "To join tables"
                ],
                correct_answer: 1,
                explanation: "WHERE clause is used to filter records based on specified conditions."
            },
            {
                id: 4,
                question: "Which SQL command is used to add new records to a table?",
                options: [
                    "ADD",
                    "INSERT",
                    "CREATE",
                    "UPDATE"
                ],
                correct_answer: 1,
                explanation: "INSERT is used to add new records to a table."
            },
            {
                id: 5,
                question: "What is a primary key?",
                options: [
                    "A unique identifier for each record",
                    "A foreign key reference",
                    "A column that can be null",
                    "A temporary key"
                ],
                correct_answer: 0,
                explanation: "A primary key is a unique identifier for each record in a table."
            },
            {
                id: 6,
                question: "Which SQL command is used to update existing records?",
                options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
                correct_answer: 0,
                explanation: "UPDATE is used to modify existing records in a table."
            },
            {
                id: 7,
                question: "What is the purpose of the GROUP BY clause?",
                options: ["To group data", "To sort data", "To filter data", "To join tables"],
                correct_answer: 0,
                explanation: "GROUP BY is used to group rows that have the same values."
            },
            {
                id: 8,
                question: "Which SQL command is used to delete records?",
                options: ["DELETE", "REMOVE", "DROP", "CLEAR"],
                correct_answer: 0,
                explanation: "DELETE is used to remove records from a table."
            },
            {
                id: 9,
                question: "What is the purpose of the HAVING clause?",
                options: ["To filter groups", "To sort groups", "To join groups", "To create groups"],
                correct_answer: 0,
                explanation: "HAVING is used to filter groups after GROUP BY."
            },
            {
                id: 10,
                question: "Which SQL command is used to create a table?",
                options: ["CREATE TABLE", "MAKE TABLE", "BUILD TABLE", "NEW TABLE"],
                correct_answer: 0,
                explanation: "CREATE TABLE is used to create a new table."
            },
            {
                id: 11,
                question: "What is the purpose of the ORDER BY clause?",
                options: ["To sort results", "To group results", "To filter results", "To join results"],
                correct_answer: 0,
                explanation: "ORDER BY is used to sort the result set."
            },
            {
                id: 12,
                question: "Which SQL command is used to add columns to a table?",
                options: ["ALTER TABLE ADD", "MODIFY TABLE ADD", "CHANGE TABLE ADD", "UPDATE TABLE ADD"],
                correct_answer: 0,
                explanation: "ALTER TABLE ADD is used to add new columns to an existing table."
            },
            {
                id: 13,
                question: "What is the purpose of the DISTINCT keyword?",
                options: ["To remove duplicates", "To sort data", "To group data", "To filter data"],
                correct_answer: 0,
                explanation: "DISTINCT is used to return only unique values."
            },
            {
                id: 14,
                question: "Which SQL command is used to remove a table?",
                options: ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "CLEAR TABLE"],
                correct_answer: 0,
                explanation: "DROP TABLE is used to delete an entire table."
            },
            {
                id: 15,
                question: "What is the purpose of the LIKE operator?",
                options: ["To search patterns", "To compare values", "To sort data", "To group data"],
                correct_answer: 0,
                explanation: "LIKE is used to search for a specified pattern in a column."
            },
            {
                id: 16,
                question: "Which SQL command is used to create an index?",
                options: ["CREATE INDEX", "MAKE INDEX", "BUILD INDEX", "NEW INDEX"],
                correct_answer: 0,
                explanation: "CREATE INDEX is used to create an index on a table."
            },
            {
                id: 17,
                question: "What is the purpose of the IN operator?",
                options: ["To specify multiple values", "To compare values", "To sort data", "To group data"],
                correct_answer: 0,
                explanation: "IN is used to specify multiple values in a WHERE clause."
            },
            {
                id: 18,
                question: "Which SQL command is used to modify table structure?",
                options: ["ALTER TABLE", "MODIFY TABLE", "CHANGE TABLE", "UPDATE TABLE"],
                correct_answer: 0,
                explanation: "ALTER TABLE is used to modify the structure of an existing table."
            },
            {
                id: 19,
                question: "What is the purpose of the BETWEEN operator?",
                options: ["To select values in a range", "To compare values", "To sort data", "To group data"],
                correct_answer: 0,
                explanation: "BETWEEN is used to select values within a given range."
            },
            {
                id: 20,
                question: "Which SQL command is used to create a view?",
                options: ["CREATE VIEW", "MAKE VIEW", "BUILD VIEW", "NEW VIEW"],
                correct_answer: 0,
                explanation: "CREATE VIEW is used to create a virtual table based on a SQL statement."
            }
        ]
    },

    // SQLite Database Test
    sqlite: {
        id: 6,
        test_name: 'SQLite Database Test',
        skill: { name: 'SQLite', category: 'database' },
        description: 'SQLite database management and queries',
        difficulty: 'Beginner',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What type of database is SQLite?",
                options: [
                    "Relational database",
                    "NoSQL database",
                    "Graph database",
                    "Document database"
                ],
                correct_answer: 0,
                explanation: "SQLite is a relational database management system."
            },
            {
                id: 2,
                question: "What is the main advantage of SQLite?",
                options: [
                    "Serverless and embedded",
                    "High performance",
                    "Cloud-based",
                    "Multi-user support"
                ],
                correct_answer: 0,
                explanation: "SQLite is serverless and embedded, making it easy to use in applications."
            },
            {
                id: 3,
                question: "Which file extension is used for SQLite databases?",
                options: [
                    ".sql",
                    ".db",
                    ".sqlite",
                    "All of the above"
                ],
                correct_answer: 3,
                explanation: "SQLite databases can use .sql, .db, .sqlite, or other extensions."
            },
            {
                id: 4,
                question: "What is the maximum database size in SQLite?",
                options: [
                    "1 GB",
                    "2 GB",
                    "281 TB",
                    "Unlimited"
                ],
                correct_answer: 2,
                explanation: "SQLite can handle databases up to 281 terabytes in size."
            },
            {
                id: 5,
                question: "Which programming languages can access SQLite?",
                options: [
                    "Python only",
                    "JavaScript only",
                    "Multiple languages",
                    "C++ only"
                ],
                correct_answer: 2,
                explanation: "SQLite can be accessed from many programming languages including Python, JavaScript, C++, etc."
            },
            {
                id: 6,
                question: "Which data type is used for storing text in SQLite?",
                options: ["TEXT", "VARCHAR", "STRING", "CHAR"],
                correct_answer: 0,
                explanation: "SQLite uses TEXT for storing text data."
            },
            {
                id: 7,
                question: "What is the maximum number of columns in a SQLite table?",
                options: ["2000", "1000", "500", "Unlimited"],
                correct_answer: 0,
                explanation: "SQLite supports up to 2000 columns per table."
            },
            {
                id: 8,
                question: "Which command is used to open a SQLite database?",
                options: ["sqlite3", "sqlite", "open", "connect"],
                correct_answer: 0,
                explanation: "sqlite3 command is used to open a SQLite database."
            },
            {
                id: 9,
                question: "What is the purpose of the .tables command in SQLite?",
                options: ["To list all tables", "To create tables", "To delete tables", "To modify tables"],
                correct_answer: 0,
                explanation: ".tables command lists all tables in the current database."
            },
            {
                id: 10,
                question: "Which data type is used for storing integers in SQLite?",
                options: ["INTEGER", "INT", "NUMBER", "NUMERIC"],
                correct_answer: 0,
                explanation: "SQLite uses INTEGER for storing integer values."
            },
            {
                id: 11,
                question: "What is the purpose of the .schema command in SQLite?",
                options: ["To show table structure", "To create tables", "To delete tables", "To modify tables"],
                correct_answer: 0,
                explanation: ".schema command shows the structure of tables."
            },
            {
                id: 12,
                question: "Which command is used to exit SQLite?",
                options: [".quit", ".exit", ".close", ".end"],
                correct_answer: 0,
                explanation: ".quit command is used to exit SQLite."
            },
            {
                id: 13,
                question: "What is the purpose of the .help command in SQLite?",
                options: ["To show help", "To create help", "To delete help", "To modify help"],
                correct_answer: 0,
                explanation: ".help command shows available SQLite commands."
            },
            {
                id: 14,
                question: "Which data type is used for storing real numbers in SQLite?",
                options: ["REAL", "FLOAT", "DOUBLE", "DECIMAL"],
                correct_answer: 0,
                explanation: "SQLite uses REAL for storing floating-point numbers."
            },
            {
                id: 15,
                question: "What is the purpose of the .mode command in SQLite?",
                options: ["To set output format", "To create mode", "To delete mode", "To modify mode"],
                correct_answer: 0,
                explanation: ".mode command sets the output format for query results."
            },
            {
                id: 16,
                question: "Which command is used to show SQLite version?",
                options: [".version", ".ver", ".info", ".about"],
                correct_answer: 0,
                explanation: ".version command shows the SQLite version information."
            },
            {
                id: 17,
                question: "What is the purpose of the .headers command in SQLite?",
                options: ["To show column headers", "To create headers", "To delete headers", "To modify headers"],
                correct_answer: 0,
                explanation: ".headers command toggles column headers in query results."
            },
            {
                id: 18,
                question: "Which data type is used for storing binary data in SQLite?",
                options: ["BLOB", "BINARY", "BYTE", "DATA"],
                correct_answer: 0,
                explanation: "SQLite uses BLOB for storing binary large objects."
            },
            {
                id: 19,
                question: "What is the purpose of the .width command in SQLite?",
                options: ["To set column width", "To create width", "To delete width", "To modify width"],
                correct_answer: 0,
                explanation: ".width command sets the width of columns in output."
            },
            {
                id: 20,
                question: "Which command is used to show SQLite database info?",
                options: [".dbinfo", ".info", ".status", ".about"],
                correct_answer: 0,
                explanation: ".dbinfo command shows information about the current database."
            }
        ]
    },

    // Java Fundamentals Test
    java: {
        id: 7,
        test_name: 'Java Fundamentals Test',
        skill: { name: 'Java', category: 'programming' },
        description: 'Core Java programming concepts',
        difficulty: 'Intermediate',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is the main method signature in Java?",
                options: [
                    "public static void main(String[] args)",
                    "public void main(String[] args)",
                    "public static main(String[] args)",
                    "static void main(String[] args)"
                ],
                correct_answer: 0,
                explanation: "The main method must be public, static, void, and take String[] args parameter."
            },
            {
                id: 2,
                question: "Which keyword is used to create an object in Java?",
                options: [
                    "new",
                    "create",
                    "object",
                    "instance"
                ],
                correct_answer: 0,
                explanation: "The 'new' keyword is used to create new objects in Java."
            },
            {
                id: 3,
                question: "What is the default value of an int variable in Java?",
                options: [
                    "0",
                    "null",
                    "undefined",
                    "1"
                ],
                correct_answer: 0,
                explanation: "The default value of an int variable in Java is 0."
            },
            {
                id: 4,
                question: "Which access modifier provides the most restrictive access?",
                options: [
                    "public",
                    "protected",
                    "default",
                    "private"
                ],
                correct_answer: 3,
                explanation: "private provides the most restrictive access, only within the same class."
            },
            {
                id: 5,
                question: "What is inheritance in Java?",
                options: [
                    "A way to create multiple objects",
                    "A mechanism to acquire properties from another class",
                    "A way to hide data",
                    "A method to override functions"
                ],
                correct_answer: 1,
                explanation: "Inheritance allows a class to acquire properties and methods from another class."
            },
            {
                id: 6,
                question: "What is the purpose of the 'static' keyword in Java?",
                options: ["To create class-level members", "To create instance members", "To create local members", "To create global members"],
                correct_answer: 0,
                explanation: "static keyword creates class-level members that belong to the class, not instances."
            },
            {
                id: 7,
                question: "Which keyword is used to prevent inheritance in Java?",
                options: ["final", "static", "private", "sealed"],
                correct_answer: 0,
                explanation: "final keyword prevents a class from being inherited."
            },
            {
                id: 8,
                question: "What is the purpose of the 'super' keyword in Java?",
                options: ["To access parent class members", "To create super classes", "To delete classes", "To modify classes"],
                correct_answer: 0,
                explanation: "super keyword is used to access parent class members and constructors."
            },
            {
                id: 9,
                question: "Which keyword is used to handle exceptions in Java?",
                options: ["try-catch", "try-except", "if-else", "switch-case"],
                correct_answer: 0,
                explanation: "try-catch blocks are used to handle exceptions in Java."
            },
            {
                id: 10,
                question: "What is the purpose of the 'this' keyword in Java?",
                options: ["To refer to current object", "To create objects", "To delete objects", "To modify objects"],
                correct_answer: 0,
                explanation: "this keyword refers to the current object instance."
            },
            {
                id: 11,
                question: "Which keyword is used to create an interface in Java?",
                options: ["interface", "class", "abstract", "implements"],
                correct_answer: 0,
                explanation: "interface keyword is used to create interfaces in Java."
            },
            {
                id: 12,
                question: "What is the purpose of the 'abstract' keyword in Java?",
                options: ["To create abstract classes/methods", "To create concrete classes", "To delete classes", "To modify classes"],
                correct_answer: 0,
                explanation: "abstract keyword creates abstract classes and methods that must be implemented."
            },
            {
                id: 13,
                question: "Which keyword is used to implement an interface in Java?",
                options: ["implements", "extends", "inherits", "uses"],
                correct_answer: 0,
                explanation: "implements keyword is used to implement interfaces in Java."
            },
            {
                id: 14,
                question: "What is the purpose of the 'package' keyword in Java?",
                options: ["To organize classes", "To create packages", "To delete packages", "To modify packages"],
                correct_answer: 0,
                explanation: "package keyword is used to organize classes into packages."
            },
            {
                id: 15,
                question: "Which keyword is used to import classes in Java?",
                options: ["import", "include", "use", "require"],
                correct_answer: 0,
                explanation: "import keyword is used to import classes and packages in Java."
            },
            {
                id: 16,
                question: "What is the purpose of the 'synchronized' keyword in Java?",
                options: ["To control thread access", "To create threads", "To delete threads", "To modify threads"],
                correct_answer: 0,
                explanation: "synchronized keyword ensures only one thread can access a method at a time."
            },
            {
                id: 17,
                question: "Which keyword is used to create a constant in Java?",
                options: ["final", "const", "static", "constant"],
                correct_answer: 0,
                explanation: "final keyword is used to create constants in Java."
            },
            {
                id: 18,
                question: "What is the purpose of the 'volatile' keyword in Java?",
                options: ["To ensure variable visibility", "To create variables", "To delete variables", "To modify variables"],
                correct_answer: 0,
                explanation: "volatile keyword ensures that a variable's value is always read from main memory."
            },
            {
                id: 19,
                question: "Which keyword is used to create a generic class in Java?",
                options: ["<T>", "generic", "type", "param"],
                correct_answer: 0,
                explanation: "<T> syntax is used to create generic classes in Java."
            },
            {
                id: 20,
                question: "What is the purpose of the 'transient' keyword in Java?",
                options: ["To exclude fields from serialization", "To create fields", "To delete fields", "To modify fields"],
                correct_answer: 0,
                explanation: "transient keyword excludes fields from serialization process."
            }
        ]
    },

    // Git Version Control Test
    git: {
        id: 8,
        test_name: 'Git Version Control Test',
        skill: { name: 'Git', category: 'devops' },
        description: 'Version control and collaboration',
        difficulty: 'Beginner',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is Git?",
                options: [
                    "A version control system",
                    "A programming language",
                    "A database",
                    "An operating system"
                ],
                correct_answer: 0,
                explanation: "Git is a distributed version control system for tracking changes in source code."
            },
            {
                id: 2,
                question: "Which command is used to initialize a new Git repository?",
                options: [
                    "git init",
                    "git start",
                    "git create",
                    "git new"
                ],
                correct_answer: 0,
                explanation: "git init initializes a new Git repository in the current directory."
            },
            {
                id: 3,
                question: "What does 'git add' do?",
                options: [
                    "Creates a new branch",
                    "Stages changes for commit",
                    "Commits changes",
                    "Pushes changes to remote"
                ],
                correct_answer: 1,
                explanation: "git add stages changes in the working directory for the next commit."
            },
            {
                id: 4,
                question: "Which command is used to commit changes?",
                options: [
                    "git save",
                    "git commit",
                    "git push",
                    "git store"
                ],
                correct_answer: 1,
                explanation: "git commit saves the staged changes to the local repository."
            },
            {
                id: 5,
                question: "What is a branch in Git?",
                options: [
                    "A separate line of development",
                    "A file in the repository",
                    "A commit message",
                    "A remote repository"
                ],
                correct_answer: 0,
                explanation: "A branch is a separate line of development that allows you to work on features independently."
            },
            {
                id: 6,
                question: "Which command is used to check the status of files?",
                options: ["git status", "git check", "git info", "git list"],
                correct_answer: 0,
                explanation: "git status shows the current state of the working directory."
            },
            {
                id: 7,
                question: "What does 'git log' do?",
                options: ["Shows commit history", "Creates logs", "Deletes logs", "Modifies logs"],
                correct_answer: 0,
                explanation: "git log displays the commit history of the repository."
            },
            {
                id: 8,
                question: "Which command is used to see differences between files?",
                options: ["git diff", "git compare", "git show", "git display"],
                correct_answer: 0,
                explanation: "git diff shows differences between files or commits."
            },
            {
                id: 9,
                question: "What does 'git reset' do?",
                options: ["Undoes changes", "Creates changes", "Deletes changes", "Modifies changes"],
                correct_answer: 0,
                explanation: "git reset undoes changes and moves the HEAD pointer."
            },
            {
                id: 10,
                question: "Which command is used to create a new branch?",
                options: ["git branch", "git create", "git new", "git make"],
                correct_answer: 0,
                explanation: "git branch creates a new branch in the repository."
            },
            {
                id: 11,
                question: "What does 'git merge' do?",
                options: ["Combines branches", "Creates branches", "Deletes branches", "Modifies branches"],
                correct_answer: 0,
                explanation: "git merge combines changes from different branches."
            },
            {
                id: 12,
                question: "Which command is used to switch branches?",
                options: ["git checkout", "git switch", "git change", "git move"],
                correct_answer: 0,
                explanation: "git checkout switches to a different branch."
            },
            {
                id: 13,
                question: "What does 'git stash' do?",
                options: ["Saves changes temporarily", "Creates changes", "Deletes changes", "Modifies changes"],
                correct_answer: 0,
                explanation: "git stash temporarily saves uncommitted changes."
            },
            {
                id: 14,
                question: "Which command is used to see remote repositories?",
                options: ["git remote", "git list", "git show", "git display"],
                correct_answer: 0,
                explanation: "git remote shows configured remote repositories."
            },
            {
                id: 15,
                question: "What does 'git pull' do?",
                options: ["Downloads changes from remote", "Uploads changes to remote", "Deletes changes", "Modifies changes"],
                correct_answer: 0,
                explanation: "git pull downloads changes from a remote repository."
            },
            {
                id: 16,
                question: "Which command is used to see file history?",
                options: ["git log --follow", "git history", "git show", "git display"],
                correct_answer: 0,
                explanation: "git log --follow shows the history of a specific file."
            },
            {
                id: 17,
                question: "What does 'git rebase' do?",
                options: ["Replays commits on another branch", "Creates commits", "Deletes commits", "Modifies commits"],
                correct_answer: 0,
                explanation: "git rebase replays commits from one branch onto another."
            },
            {
                id: 18,
                question: "Which command is used to see changes in a commit?",
                options: ["git show", "git display", "git view", "git see"],
                correct_answer: 0,
                explanation: "git show displays the changes made in a specific commit."
            },
            {
                id: 19,
                question: "What does 'git cherry-pick' do?",
                options: ["Applies specific commits", "Creates commits", "Deletes commits", "Modifies commits"],
                correct_answer: 0,
                explanation: "git cherry-pick applies specific commits to the current branch."
            },
            {
                id: 20,
                question: "Which command is used to see branch information?",
                options: ["git branch -v", "git info", "git show", "git display"],
                correct_answer: 0,
                explanation: "git branch -v shows detailed information about branches."
            }
        ]
    },

    // HTML5 Assessment Test
    html5: {
        id: 9,
        test_name: 'HTML5 Assessment Test',
        skill: { name: 'HTML5', category: 'frontend' },
        description: 'Test your knowledge of HTML5 - personalized for your profile',
        difficulty: 'Intermediate',
        time_limit: 15,
        question_count: 20,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is the correct DOCTYPE declaration for HTML5?",
                options: [
                    "<!DOCTYPE html>",
                    "<!DOCTYPE HTML5>",
                    "<!DOCTYPE html5>",
                    "<!DOCTYPE HTML PUBLIC>"
                ],
                correct_answer: 0,
                explanation: "HTML5 uses the simple <!DOCTYPE html> declaration."
            },
            {
                id: 2,
                question: "Which HTML5 element is used for navigation?",
                options: [
                    "<nav>",
                    "<menu>",
                    "<navigation>",
                    "<navigate>"
                ],
                correct_answer: 0,
                explanation: "The <nav> element is used to define navigation links."
            },
            {
                id: 3,
                question: "What is the purpose of the <article> element?",
                options: [
                    "To define a sidebar",
                    "To define independent content",
                    "To define a header",
                    "To define a footer"
                ],
                correct_answer: 1,
                explanation: "The <article> element defines independent, self-contained content."
            },
            {
                id: 4,
                question: "Which attribute is used to make an input field required in HTML5?",
                options: [
                    "mandatory",
                    "required",
                    "must",
                    "needed"
                ],
                correct_answer: 1,
                explanation: "The 'required' attribute makes an input field mandatory in HTML5."
            },
            {
                id: 5,
                question: "What is the purpose of the <canvas> element?",
                options: [
                    "To display images",
                    "To draw graphics with JavaScript",
                    "To create forms",
                    "To embed videos"
                ],
                correct_answer: 1,
                explanation: "The <canvas> element is used to draw graphics, animations, and other visual elements with JavaScript."
            },
            {
                id: 6,
                question: "Which HTML5 element is used for audio?",
                options: ["<audio>", "<sound>", "<music>", "<play>"],
                correct_answer: 0,
                explanation: "The <audio> element is used to embed audio content in HTML5."
            },
            {
                id: 7,
                question: "What is the purpose of the <video> element?",
                options: ["To embed video content", "To create videos", "To delete videos", "To modify videos"],
                correct_answer: 0,
                explanation: "The <video> element is used to embed video content in HTML5."
            },
            {
                id: 8,
                question: "Which HTML5 element is used for sidebars?",
                options: ["<aside>", "<sidebar>", "<side>", "<nav>"],
                correct_answer: 0,
                explanation: "The <aside> element is used to define sidebars in HTML5."
            },
            {
                id: 9,
                question: "What is the purpose of the <section> element?",
                options: ["To define sections", "To create sections", "To delete sections", "To modify sections"],
                correct_answer: 0,
                explanation: "The <section> element defines sections in a document."
            },
            {
                id: 10,
                question: "Which HTML5 element is used for headers?",
                options: ["<header>", "<head>", "<title>", "<h1>"],
                correct_answer: 0,
                explanation: "The <header> element defines a header for a document or section."
            },
            {
                id: 11,
                question: "What is the purpose of the <footer> element?",
                options: ["To define footers", "To create footers", "To delete footers", "To modify footers"],
                correct_answer: 0,
                explanation: "The <footer> element defines a footer for a document or section."
            },
            {
                id: 12,
                question: "Which HTML5 element is used for figures?",
                options: ["<figure>", "<img>", "<picture>", "<photo>"],
                correct_answer: 0,
                explanation: "The <figure> element specifies self-contained content like illustrations."
            },
            {
                id: 13,
                question: "What is the purpose of the <figcaption> element?",
                options: ["To caption figures", "To create figures", "To delete figures", "To modify figures"],
                correct_answer: 0,
                explanation: "The <figcaption> element provides a caption for a <figure> element."
            },
            {
                id: 14,
                question: "Which HTML5 element is used for progress bars?",
                options: ["<progress>", "<bar>", "<meter>", "<gauge>"],
                correct_answer: 0,
                explanation: "The <progress> element represents the progress of a task."
            },
            {
                id: 15,
                question: "What is the purpose of the <meter> element?",
                options: ["To display measurements", "To create measurements", "To delete measurements", "To modify measurements"],
                correct_answer: 0,
                explanation: "The <meter> element represents a scalar measurement within a known range."
            },
            {
                id: 16,
                question: "Which HTML5 element is used for details?",
                options: ["<details>", "<info>", "<data>", "<content>"],
                correct_answer: 0,
                explanation: "The <details> element creates a disclosure widget with additional information."
            },
            {
                id: 17,
                question: "What is the purpose of the <summary> element?",
                options: ["To summarize details", "To create details", "To delete details", "To modify details"],
                correct_answer: 0,
                explanation: "The <summary> element provides a summary for a <details> element."
            },
            {
                id: 18,
                question: "Which HTML5 element is used for time?",
                options: ["<time>", "<date>", "<clock>", "<calendar>"],
                correct_answer: 0,
                explanation: "The <time> element represents a specific period in time."
            },
            {
                id: 19,
                question: "What is the purpose of the <mark> element?",
                options: ["To highlight text", "To create text", "To delete text", "To modify text"],
                correct_answer: 0,
                explanation: "The <mark> element highlights text for reference purposes."
            },
            {
                id: 20,
                question: "Which HTML5 element is used for small print?",
                options: ["<small>", "<tiny>", "<mini>", "<little>"],
                correct_answer: 0,
                explanation: "The <small> element represents side comments and small print."
            }
        ]
    },

    // Spring Boot Test
    springboot: {
        id: 10,
        test_name: 'Spring Boot Framework Test',
        skill: { name: 'Spring Boot', category: 'backend' },
        description: 'Test your knowledge of Spring Boot framework',
        difficulty: 'Intermediate',
        time_limit: 20,
        question_count: 15,
        total_score: 100,
        questions: [
            {
                id: 1,
                question: "What is Spring Boot?",
                options: [
                    "A Java framework for building microservices",
                    "A Python web framework",
                    "A JavaScript library",
                    "A database management system"
                ],
                correct_answer: 0,
                explanation: "Spring Boot is a Java framework that simplifies the development of Java applications, especially microservices."
            },
            {
                id: 2,
                question: "Which annotation is used to mark a class as a Spring Boot application?",
                options: [
                    "@SpringBootApplication",
                    "@Application",
                    "@SpringApp",
                    "@BootApplication"
                ],
                correct_answer: 0,
                explanation: "@SpringBootApplication is the main annotation that marks a class as a Spring Boot application."
            },
            {
                id: 3,
                question: "What is the default embedded server in Spring Boot?",
                options: [
                    "Tomcat",
                    "Jetty",
                    "Undertow",
                    "Apache"
                ],
                correct_answer: 0,
                explanation: "Spring Boot uses Tomcat as the default embedded server, though Jetty and Undertow are also supported."
            }
        ]
    }
};

// Helper function to get all tests
export const getAllTechnicalTests = () => {
    return Object.values(mockTechnicalTests);
};

// Helper function to get test by skill name
export const getTestBySkill = (skillName) => {
    const skillKey = skillName.toLowerCase();
    return mockTechnicalTests[skillKey] || null;
};

// Helper function to get random questions for a test
export const getRandomQuestions = (testId, count = 20) => {
    const test = Object.values(mockTechnicalTests).find(t => t.id === testId);
    if (!test) return [];

    const shuffled = [...test.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
