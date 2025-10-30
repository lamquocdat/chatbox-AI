import Pages from './routers';
import { ThemeProvider } from './contexts/theme';

function App() {
    return (
        <ThemeProvider>
            <Pages />
        </ThemeProvider>
    );
}

export default App;
