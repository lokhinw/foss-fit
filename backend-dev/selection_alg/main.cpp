#include <stdio.h>
#include <vector>
#include <string>

#define FOCUS_MULTIPLIER 2.5
#define FATIGUE_RUST 0.00001

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
    int id, level, sec_per_rep;
    std::vector<int> equipment, body_parts;

    exercise(int i, std::string n, std::string d, std::vector<int> e, std::vector<int> b, int l, int t)
    {
        id = i; name = n; desc = d; equipment = e; body_parts = b; level = l; sec_per_rep = t;
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
preferences p;

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

/* algorithm:
 * 1. assign each body part an intended fatigue level based on preferences
 * 2. select blocks of exercises, such that:
 *    a) every body part worked in an exercise gains fatigue
 *    b) when a body part isn't being used, it loses fatigue at a much slower rate
 */
int generate_workout()
{
    //assign intended intensity levels based on user input
    double intended_fatigue[num_body_parts];
    const double _it_ftg = num_body_parts * p.intensity; //intended total intensity
    const double _ut_ftg = (p.focus.size()*FOCUS_MULTIPLIER + (num_body_parts - p.focus.size())) * p.intensity;//unweighted total intensity
    const double _g_ftg_m = _it_ftg / _ut_ftg;//global intensity multiplier
    for (int i = 0; i < num_body_parts; ++i)
        intended_fatigue[i] = p.intensity * _g_ftg_m;
    for (int i = 0; i < p.focus.size(); ++i)
        intended_fatigue[p.focus[i]] = FOCUS_MULTIPLIER * p.intensity * _g_ftg_m;



    printf("generate_workout not yet fully implemented!\n");
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
