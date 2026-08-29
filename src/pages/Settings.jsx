import "./Settings.css"

function Settings() {
    return (
        <div className="settings">
            <div className="settings-card">
                <div className="settings-icon">⚙️</div>

                <h1>Sozlamalar</h1>

                <p className="settings-apology">
                    Uzr, bu sahifa hozircha tayyor emas.
                </p>

                <p>
                    Biz sahifa ustida ish olib boryapmiz.
                    Tayyor bo‘lishi bilan sizga xabar beramiz.
                </p>

                <div className="settings-line"></div>

                <span className="settings-status">
                    Tez orada ✨
                </span>
            </div>
        </div>
    );
}

export default Settings;