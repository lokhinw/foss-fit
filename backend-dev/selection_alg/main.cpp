#include <stdio.h>
#include <vector>
#include <string>

struct gym
{
    std::string location, name;
    std::vector<int> equipment;

    gym(std::string l, std::string n, std::vector<int> e)
    {
        location = l;
        name = n;
        equipment = e;
    }
};
struct exercise
{
    std::string name, desc;
    int id, level;
    std::vector<int> equipment, body_parts;

    exercise(int i, std::string n, std::string d, std::vector<int> e, std::vector<int> b, int l)
    {
        id = i; name = n; desc = d; equipment = e; body_parts = b; level = l;
    }
};
struct preferences
{
    //second min stands for minutes
    int min_min, max_min, pref_min;
    int intensity;
    std::vector<int> focus;
};
struct block
{
    int exercise_id, sets, reps;
    double rel_intensity;
};
std::vector<gym> gyms;
std::vector<exercise> exercises;
int num_types_equipment, num_body_parts;

int get_data();
int get_input();
int generate_workout();

int main(int argc, const char* argv[])
{
    get_data();

    get_input();

    generate_workout();

    return 0;
}

int generate_workout()
{
    printf("generate_workout not yet implemented!\n");
    return 0;
}

int get_data()
{
    printf("get_data not yet implemented!\n");
    return 0;
}

int get_input()
{
    printf("get_input not yet implemented!\n");
    return 0;
}
