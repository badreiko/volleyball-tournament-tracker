import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const TimePickerModal = ({ isOpen, onClose, onSave, currentTime, t }) => {
    // Парсим текущее время или ставим дефолт
    const [hours, setHours] = useState(currentTime ? currentTime.split(':')[0] : '09');
    const [minutes, setMinutes] = useState(currentTime ? currentTime.split(':')[1] : '00');

    const handleSave = () => {
        onSave(`${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-[280px]"
                    >
                        {/* Header */}
                        <div className="bg-[#06324F] p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <FaClock className="text-[#0B8E8D]" />
                                {t.timeStart || 'Время начала'}
                            </div>
                            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Picker Body */}
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                {/* Hours */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{t.hours || 'Часы'}</span>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="23" 
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value.slice(0, 2))}
                                        className="w-16 h-16 text-3xl font-black text-center bg-gray-50 border-2 border-gray-100 rounded-2xl text-[#06324F] focus:border-[#0B8E8D] outline-none transition-all"
                                    />
                                </div>

                                <div className="text-3xl font-black text-gray-300 self-end mb-2">:</div>

                                {/* Minutes */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{t.minutesShort || 'Мин'}</span>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="59" 
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value.slice(0, 2))}
                                        className="w-16 h-16 text-3xl font-black text-center bg-gray-50 border-2 border-gray-100 rounded-2xl text-[#06324F] focus:border-[#0B8E8D] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {['00', '15', '30', '45'].map(m => (
                                    <button 
                                        key={m} 
                                        onClick={() => setMinutes(m)}
                                        className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${minutes === m ? 'bg-[#0B8E8D] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        :{m}
                                    </button>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={handleSave}
                                className="w-full bg-[#0B8E8D] text-white py-3 rounded-2xl shadow-lg shadow-[#0B8E8D]/20 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                            >
                                <FaCheck /> {t.apply || 'Применить'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TimePickerModal;
