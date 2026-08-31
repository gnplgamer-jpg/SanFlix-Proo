const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "  const [isPHubEnabled, setIsPHubEnabledState] = useState(false);\n  useEffect(() => {\n     setIsPHubEnabledState(localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true');\n  }, []);",
  ""
);

code = code.replace(
  /setIsPHubEnabledState/g,
  'setIsPHubEnabled'
);

fs.writeFileSync('src/App.tsx', code);
