import subprocess

def execute_mongoexport_commands():
    # Define the export commands
    json_export_command = [
        'mongoexport',
        '--db', 'F1_drivers',
        '--collection', 'drivers_with_teams',
        '--out', r'C:\FER\OTVRAC\Lab1\F1_drivers.json',
        '--jsonArray'
    ]
    
    csv_export_command = [
        'mongoexport',
        '--db', 'F1_drivers',
        '--collection', 'drivers_with_teams',
        '--out', r'C:\FER\OTVRAC\Lab1\F1_drivers.csv',
        '--type=csv',
        '--fields', 'name,surname,nationality,wins,podiums,poles,points,championships,races_done,status,current_team.name,current_team.country,current_team.founded_year,current_team.championships_won'
    ]

    try:
        # Execute the JSON export command
        print("Exporting to JSON...")
        subprocess.run(json_export_command, check=True)
        print("JSON export completed successfully.")

        # Execute the CSV export command
        print("Exporting to CSV...")
        subprocess.run(csv_export_command, check=True)
        print("CSV export completed successfully.")
    
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while executing the commands: {e}")

if __name__ == "__main__":
    execute_mongoexport_commands()
