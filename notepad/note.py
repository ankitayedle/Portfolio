import tkinter as tk
from tkinter import filedialog, messagebox, font
import os

class NotepadClone:
    def __init__(self, root):
        self.root = root
        self.root.title("Notepad Clone")
        self.root.geometry("1000x600")
        
        # Set application icon (using a simple text icon)
        self.root.iconbitmap(default=self.create_icon())
        
        # Initialize variables
        self.files = []
        self.current_file_index = -1
        self.font_size = 12
        self.font_family = "Courier"
        
        # Setup UI
        self.setup_menu()
        self.setup_toolbar()
        self.setup_main_layout()
        
        # Create initial empty tab
        self.create_new_tab()
        
        # Bind keyboard shortcuts
        self.setup_shortcuts()
        
    def create_icon(self):
        # Create a simple icon for the application
        import tempfile
        icon_data = """
        #define icon_width 32
        #define icon_height 32
        static unsigned char icon_bits[] = {
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        };
        """
        # Create a temporary icon file
        temp_icon = tempfile.NamedTemporaryFile(delete=False, suffix='.ico')
        temp_icon.close()
        return temp_icon.name

    def setup_menu(self):
        # Create menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="New", command=self.create_new_tab, accelerator="Ctrl+N")
        file_menu.add_command(label="Open", command=self.open_file, accelerator="Ctrl+O")
        file_menu.add_command(label="Save", command=self.save_file, accelerator="Ctrl+S")
        file_menu.add_command(label="Save As", command=self.save_as_file, accelerator="Ctrl+Shift+S")
        file_menu.add_separator()
        file_menu.add_command(label="Close Tab", command=self.close_current_tab, accelerator="Ctrl+W")
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.exit_app)
        
        # Edit menu
        edit_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Edit", menu=edit_menu)
        edit_menu.add_command(label="Undo", command=self.undo, accelerator="Ctrl+Z")
        edit_menu.add_command(label="Redo", command=self.redo, accelerator="Ctrl+Y")
        edit_menu.add_separator()
        edit_menu.add_command(label="Cut", command=self.cut, accelerator="Ctrl+X")
        edit_menu.add_command(label="Copy", command=self.copy, accelerator="Ctrl+C")
        edit_menu.add_command(label="Paste", command=self.paste, accelerator="Ctrl+V")
        edit_menu.add_separator()
        edit_menu.add_command(label="Select All", command=self.select_all, accelerator="Ctrl+A")
        
        # Format menu
        format_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Format", menu=format_menu)
        format_menu.add_command(label="Word Wrap", command=self.toggle_word_wrap)
        format_menu.add_command(label="Font...", command=self.change_font)
        
        # View menu
        view_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="View", menu=view_menu)
        view_menu.add_command(label="Zoom In", command=self.zoom_in, accelerator="Ctrl++")
        view_menu.add_command(label="Zoom Out", command=self.zoom_out, accelerator="Ctrl+-")
        view_menu.add_command(label="Reset Zoom", command=self.zoom_reset, accelerator="Ctrl+0")
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)
        
    def setup_toolbar(self):
        # Create a simple toolbar
        toolbar = tk.Frame(self.root, bd=1, relief=tk.RAISED)
        toolbar.pack(side=tk.TOP, fill=tk.X)
        
        # New file button
        new_btn = tk.Button(toolbar, text="New", command=self.create_new_tab)
        new_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
        # Open file button
        open_btn = tk.Button(toolbar, text="Open", command=self.open_file)
        open_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
        # Save file button
        save_btn = tk.Button(toolbar, text="Save", command=self.save_file)
        save_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
        # Separator
        sep = tk.Frame(toolbar, height=2, width=10, bd=1, relief=tk.SUNKEN)
        sep.pack(side=tk.LEFT, padx=5, pady=2)
        
        # Cut button
        cut_btn = tk.Button(toolbar, text="Cut", command=self.cut)
        cut_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
        # Copy button
        copy_btn = tk.Button(toolbar, text="Copy", command=self.copy)
        copy_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
        # Paste button
        paste_btn = tk.Button(toolbar, text="Paste", command=self.paste)
        paste_btn.pack(side=tk.LEFT, padx=2, pady=2)
        
    def setup_main_layout(self):
        # Main container with vertical tabs on the left
        main_container = tk.PanedWindow(self.root, orient=tk.HORIZONTAL, sashwidth=5)
        main_container.pack(fill=tk.BOTH, expand=True)
        
        # Left panel for vertical tabs
        self.left_panel = tk.Frame(main_container, width=200, bg="#f0f0f0")
        main_container.add(self.left_panel)
        
        # Tab header
        tab_header = tk.Frame(self.left_panel, bg="#2d2d2d", height=30)
        tab_header.pack(fill=tk.X)
        tab_header.pack_propagate(False)
        
        tab_label = tk.Label(tab_header, text="TABS", fg="white", bg="#2d2d2d", font=("Arial", 10, "bold"))
        tab_label.pack(side=tk.LEFT, padx=10, pady=5)
        
        # Add new tab button
        add_tab_btn = tk.Button(tab_header, text="+", bg="#2d2d2d", fg="white", 
                               bd=0, font=("Arial", 12, "bold"), command=self.create_new_tab)
        add_tab_btn.pack(side=tk.RIGHT, padx=5)
        
        # Tab list container
        self.tab_list_frame = tk.Frame(self.left_panel, bg="#f0f0f0")
        self.tab_list_frame.pack(fill=tk.BOTH, expand=True)
        
        # Right panel for text editor
        self.right_panel = tk.Frame(main_container, bg="white")
        main_container.add(self.right_panel)
        
        # Text area frame
        self.text_frame = tk.Frame(self.right_panel)
        self.text_frame.pack(fill=tk.BOTH, expand=True)
        
        # Status bar
        self.status_bar = tk.Label(self.root, text="Line 1, Column 1 | Tab 1", bd=1, relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
    def setup_shortcuts(self):
        # Bind keyboard shortcuts
        self.root.bind("<Control-n>", lambda e: self.create_new_tab())
        self.root.bind("<Control-o>", lambda e: self.open_file())
        self.root.bind("<Control-s>", lambda e: self.save_file())
        self.root.bind("<Control-S>", lambda e: self.save_as_file())
        self.root.bind("<Control-w>", lambda e: self.close_current_tab())
        self.root.bind("<Control-plus>", lambda e: self.zoom_in())
        self.root.bind("<Control-minus>", lambda e: self.zoom_out())
        self.root.bind("<Control-0>", lambda e: self.zoom_reset())
        
    def create_new_tab(self, filename="Untitled", content=""):
        # Create a new tab
        tab_id = len(self.files)
        
        # Create text widget for the new tab
        text_widget = tk.Text(self.text_frame, wrap=tk.WORD, undo=True, font=(self.font_family, self.font_size))
        text_widget.pack(fill=tk.BOTH, expand=True)
        
        # Hide all text widgets except the new one if it's not the first
        if tab_id > 0:
            text_widget.pack_forget()
        
        # Insert initial content if provided
        if content:
            text_widget.insert(1.0, content)
        
        # Bind text change event
        text_widget.bind("<<Modified>>", lambda e: self.on_text_change(text_widget))
        text_widget.bind("<KeyRelease>", lambda e: self.update_status_bar())
        
        # Create tab button in the vertical tab bar
        tab_button_frame = tk.Frame(self.tab_list_frame, bg="#e0e0e0", height=30)
        tab_button_frame.pack(fill=tk.X, pady=1)
        
        # Extract just the filename from the path
        display_name = os.path.basename(filename) if filename != "Untitled" else filename
        
        tab_button = tk.Button(
            tab_button_frame, 
            text=f"  {display_name}", 
            anchor=tk.W,
            bg="#e0e0e0" if tab_id != 0 else "#d0d0ff",
            fg="black",
            bd=0,
            font=("Arial", 10),
            command=lambda idx=tab_id: self.switch_tab(idx)
        )
        tab_button.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Close button for the tab
        close_button = tk.Button(
            tab_button_frame,
            text="×",
            bg="#e0e0e0" if tab_id != 0 else "#d0d0ff",
            fg="black",
            bd=0,
            font=("Arial", 12),
            width=2,
            command=lambda idx=tab_id: self.close_tab(idx)
        )
        close_button.pack(side=tk.RIGHT)
        
        # Store tab information
        tab_info = {
            'id': tab_id,
            'filename': filename,
            'text_widget': text_widget,
            'tab_button': tab_button,
            'close_button': close_button,
            'tab_button_frame': tab_button_frame,
            'saved': True if filename != "Untitled" else False
        }
        
        self.files.append(tab_info)
        
        # Switch to the new tab
        self.switch_tab(tab_id)
        
        # Update status bar
        self.update_status_bar()
        
        return tab_id
    
    def switch_tab(self, tab_id):
        # Hide all text widgets
        for file_info in self.files:
            file_info['text_widget'].pack_forget()
            file_info['tab_button_frame'].config(bg="#e0e0e0")
            file_info['tab_button'].config(bg="#e0e0e0")
            file_info['close_button'].config(bg="#e0e0e0")
        
        # Show selected tab's text widget
        self.files[tab_id]['text_widget'].pack(fill=tk.BOTH, expand=True)
        
        # Highlight selected tab
        self.files[tab_id]['tab_button_frame'].config(bg="#d0d0ff")
        self.files[tab_id]['tab_button'].config(bg="#d0d0ff")
        self.files[tab_id]['close_button'].config(bg="#d0d0ff")
        
        # Update current file index
        self.current_file_index = tab_id
        
        # Update status bar
        self.update_status_bar()
        
        # Focus on the text widget
        self.files[tab_id]['text_widget'].focus_set()
        
    def close_current_tab(self):
        if self.current_file_index >= 0:
            self.close_tab(self.current_file_index)
    
    def close_tab(self, tab_id):
        # Check if content is saved
        if not self.files[tab_id]['saved']:
            filename = self.files[tab_id]['filename']
            response = messagebox.askyesnocancel(
                "Save Changes", 
                f"Do you want to save changes to {filename}?"
            )
            
            if response is None:  # Cancel
                return
            elif response:  # Yes
                if not self.save_file(tab_id):
                    return  # User cancelled save
        
        # If this is the only tab, create a new empty one
        if len(self.files) == 1:
            self.create_new_tab()
        
        # Remove the tab
        self.files[tab_id]['text_widget'].destroy()
        self.files[tab_id]['tab_button_frame'].destroy()
        
        # Remove from list
        self.files.pop(tab_id)
        
        # Re-index remaining tabs
        for i, file_info in enumerate(self.files):
            file_info['id'] = i
            file_info['tab_button'].config(command=lambda idx=i: self.switch_tab(idx))
            file_info['close_button'].config(command=lambda idx=i: self.close_tab(idx))
        
        # Switch to another tab
        if tab_id >= len(self.files):
            self.switch_tab(len(self.files) - 1)
        elif len(self.files) > 0:
            self.switch_tab(tab_id)
            
    def open_file(self):
        filename = filedialog.askopenfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if filename:
            # Check if file is already open
            for file_info in self.files:
                if file_info['filename'] == filename:
                    self.switch_tab(file_info['id'])
                    return
            
            # Read file content
            try:
                with open(filename, 'r') as file:
                    content = file.read()
                
                # Create new tab with file content
                self.create_new_tab(filename, content)
            except Exception as e:
                messagebox.showerror("Error", f"Could not open file: {e}")
    
    def save_file(self, tab_id=None):
        if tab_id is None:
            tab_id = self.current_file_index
            
        if tab_id < 0 or tab_id >= len(self.files):
            return False
            
        file_info = self.files[tab_id]
        
        # If file is "Untitled", use Save As
        if file_info['filename'] == "Untitled":
            return self.save_as_file(tab_id)
        
        # Save to existing file
        try:
            content = file_info['text_widget'].get(1.0, tk.END)
            with open(file_info['filename'], 'w') as file:
                file.write(content)
            
            file_info['saved'] = True
            self.update_tab_title(tab_id)
            
            # Update status bar
            self.update_status_bar()
            
            return True
        except Exception as e:
            messagebox.showerror("Error", f"Could not save file: {e}")
            return False
    
    def save_as_file(self, tab_id=None):
        if tab_id is None:
            tab_id = self.current_file_index
            
        if tab_id < 0 or tab_id >= len(self.files):
            return False
            
        file_info = self.files[tab_id]
        
        # Ask for filename
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if filename:
            try:
                content = file_info['text_widget'].get(1.0, tk.END)
                with open(filename, 'w') as file:
                    file.write(content)
                
                file_info['filename'] = filename
                file_info['saved'] = True
                self.update_tab_title(tab_id)
                
                # Update status bar
                self.update_status_bar()
                
                return True
            except Exception as e:
                messagebox.showerror("Error", f"Could not save file: {e}")
                return False
        
        return False
    
    def update_tab_title(self, tab_id):
        file_info = self.files[tab_id]
        display_name = os.path.basename(file_info['filename'])
        
        # Add asterisk if not saved
        if not file_info['saved']:
            display_name = "*" + display_name
            
        file_info['tab_button'].config(text=f"  {display_name}")
    
    def on_text_change(self, text_widget):
        # Find which tab this text widget belongs to
        for i, file_info in enumerate(self.files):
            if file_info['text_widget'] == text_widget:
                # Reset the modified flag
                text_widget.edit_modified(False)
                
                # Mark as unsaved
                if file_info['saved']:
                    file_info['saved'] = False
                    self.update_tab_title(i)
                break
    
    def update_status_bar(self):
        if self.current_file_index >= 0:
            file_info = self.files[self.current_file_index]
            text_widget = file_info['text_widget']
            
            # Get cursor position
            cursor_pos = text_widget.index(tk.INSERT)
            line, col = cursor_pos.split('.')
            
            # Get total lines
            total_lines = text_widget.index('end-1c').split('.')[0]
            
            # Update status bar
            filename = os.path.basename(file_info['filename'])
            status_text = f"Tab {self.current_file_index+1}: {filename} | Line {line}, Column {col} | Total Lines: {total_lines}"
            
            if not file_info['saved']:
                status_text += " | Unsaved changes"
                
            self.status_bar.config(text=status_text)
    
    def undo(self):
        if self.current_file_index >= 0:
            try:
                self.files[self.current_file_index]['text_widget'].edit_undo()
            except:
                pass  # Nothing to undo
    
    def redo(self):
        if self.current_file_index >= 0:
            try:
                self.files[self.current_file_index]['text_widget'].edit_redo()
            except:
                pass  # Nothing to redo
    
    def cut(self):
        if self.current_file_index >= 0:
            self.files[self.current_file_index]['text_widget'].event_generate("<<Cut>>")
    
    def copy(self):
        if self.current_file_index >= 0:
            self.files[self.current_file_index]['text_widget'].event_generate("<<Copy>>")
    
    def paste(self):
        if self.current_file_index >= 0:
            self.files[self.current_file_index]['text_widget'].event_generate("<<Paste>>")
    
    def select_all(self):
        if self.current_file_index >= 0:
            text_widget = self.files[self.current_file_index]['text_widget']
            text_widget.tag_add(tk.SEL, "1.0", tk.END)
            text_widget.mark_set(tk.INSERT, "1.0")
            text_widget.see(tk.INSERT)
    
    def toggle_word_wrap(self):
        if self.current_file_index >= 0:
            text_widget = self.files[self.current_file_index]['text_widget']
            current_wrap = text_widget.cget("wrap")
            new_wrap = tk.NONE if current_wrap == tk.WORD else tk.WORD
            text_widget.config(wrap=new_wrap)
    
    def change_font(self):
        # Simple font dialog
        font_dialog = tk.Toplevel(self.root)
        font_dialog.title("Font")
        font_dialog.geometry("300x200")
        font_dialog.transient(self.root)
        font_dialog.grab_set()
        
        # Font family selection
        tk.Label(font_dialog, text="Font Family:").pack(pady=(10, 0))
        font_family_var = tk.StringVar(value=self.font_family)
        font_family_entry = tk.Entry(font_dialog, textvariable=font_family_var)
        font_family_entry.pack(pady=5, padx=20, fill=tk.X)
        
        # Font size selection
        tk.Label(font_dialog, text="Font Size:").pack(pady=(10, 0))
        font_size_var = tk.StringVar(value=str(self.font_size))
        font_size_spinbox = tk.Spinbox(font_dialog, from_=8, to=72, textvariable=font_size_var)
        font_size_spinbox.pack(pady=5, padx=20)
        
        # Apply button
        def apply_font():
            self.font_family = font_family_var.get()
            self.font_size = int(font_size_var.get())
            
            # Apply to all text widgets
            for file_info in self.files:
                file_info['text_widget'].config(font=(self.font_family, self.font_size))
            
            font_dialog.destroy()
        
        tk.Button(font_dialog, text="Apply", command=apply_font).pack(pady=20)
    
    def zoom_in(self):
        self.font_size += 1
        for file_info in self.files:
            file_info['text_widget'].config(font=(self.font_family, self.font_size))
    
    def zoom_out(self):
        if self.font_size > 8:
            self.font_size -= 1
            for file_info in self.files:
                file_info['text_widget'].config(font=(self.font_family, self.font_size))
    
    def zoom_reset(self):
        self.font_size = 12
        for file_info in self.files:
            file_info['text_widget'].config(font=(self.font_family, self.font_size))
    
    def show_about(self):
        about_text = """Notepad Clone with Vertical Tabs
        
A simple text editor with tabbed interface
        
Features:
- Multiple tabs with vertical tab bar
- File operations (New, Open, Save, Save As)
- Basic text editing (Cut, Copy, Paste, Undo, Redo)
- Font customization
- Zoom in/out functionality
- Word wrap toggle
        
Created with Python and Tkinter"""
        
        messagebox.showinfo("About Notepad Clone", about_text)
    
    def exit_app(self):
        # Check for unsaved changes
        unsaved_tabs = []
        for i, file_info in enumerate(self.files):
            if not file_info['saved']:
                unsaved_tabs.append(file_info['filename'])
        
        if unsaved_tabs:
            response = messagebox.askyesnocancel(
                "Unsaved Changes", 
                f"You have unsaved changes in {len(unsaved_tabs)} tab(s). Do you want to save before exiting?"
            )
            
            if response is None:  # Cancel
                return
            elif response:  # Yes
                for i, file_info in enumerate(self.files):
                    if not file_info['saved']:
                        if not self.save_file(i):
                            return  # User cancelled save
        
        self.root.quit()

# Main application
if __name__ == "__main__":
    root = tk.Tk()
    app = NotepadClone(root)
    root.mainloop()