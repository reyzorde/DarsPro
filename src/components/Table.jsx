import { FaPen } from "react-icons/fa";


function Table({ filteredStudents, editing, handleChange, handleEdit, handleSave }) {
    return <table className="students-table">

        <thead>
            <tr>
                <th>O'quvchilar</th>
                <th>Telefon</th>
                <th>Kelgan sana</th>
                <th>Dars turi</th>
                <th>To'lov holati</th>
                <th>O'quvchi holati</th>
                <th>Tahrirlash</th>
            </tr>
        </thead>

        <tbody>
            {filteredStudents.map(lead => (
                <tr key={lead.id}>

                    <td className="student-name">
                        {editing?.id === lead.id ? (
                            <input
                                type="text"
                                name="name"
                                value={editing?.name || " "}
                                onChange={handleChange}
                            />
                        ) : (
                            lead?.name
                        )}
                    </td>

                    <td className="student-phone">
                        {editing?.id === lead.id ? (
                            <input
                                type="text"
                                name="phone"
                                value={editing?.phone || " "}
                                onChange={handleChange}
                            />
                        ) : (
                            lead?.phone
                        )}
                    </td>

                    <td>
                        {lead?.date}
                    </td>

                    <td>
                        {editing?.id === lead.id ? (
                            <select
                                name="lesson"
                                value={editing?.lesson || " "}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Tanlang
                                </option>

                                <option value="Matematika">
                                    Matematika
                                </option>

                                <option value="Fizika">
                                    Fizika
                                </option>

                                <option value="SAT">
                                    SAT
                                </option>

                                <option value="Ingliz-tili">
                                    Ingliz-tili
                                </option>

                                <option value="Biologiya">
                                    Biologiya
                                </option>

                                <option value="Kimyo">
                                    Kimyo
                                </option>
                            </select>
                        ) : (
                            `${lead.lesson} Guruhi`
                        )}
                    </td>

                    <td>
                        {editing?.id === lead.id ? (
                            <select
                                name="payment"
                                value={editing?.payment || " "}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Tanlang
                                </option>

                                <option value="To'langan">
                                    To'langan
                                </option>

                                <option value="To'lanmagan">
                                    To'lanmagan
                                </option>

                                <option value="Kechikgan">
                                    O'tib ketgan
                                </option>
                            </select>
                        ) : (
                            lead.payment.at(-1)[2]
                        )}
                    </td>
                    <td>{editing?.id === lead?.id ? <select
                        name="isActive"
                        value={String(editing?.isActive ?? "")}
                        onChange={handleChange}
                    >
                        <option value="">Holat</option>
                        <option value="true">Faol</option>
                        <option value="false">Nofaol</option>
                    </select> : lead.isActive ? "Faol" : "Nofaol"}</td>

                    <td>
                        {editing?.id === lead.id ? (
                            <button
                                className="save-btn"
                                onClick={handleSave}
                            >
                                Saqlash
                            </button>
                        ) : (
                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(lead.id)}
                            >
                                <FaPen />
                            </button>
                        )}
                    </td>

                </tr>
            ))}
        </tbody>

    </table>
}

export default Table